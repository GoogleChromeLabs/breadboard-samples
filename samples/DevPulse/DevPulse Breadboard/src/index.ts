#!/usr/bin/env npx -y tsx watch
import {
	ConfigKit,
	HackerNewsAlgoliaKit,
	HackerNewsFirebaseKit,
	JsonKit,
	ListKit,
	ObjectKit,
	StringKit,
	util
} from "@exadev/breadboard-kits";
import { MarkdownContentType } from "@exadev/breadboard-kits/dist/types/markdown.js";
import { Board } from "@google-labs/breadboard";
import Core from "@google-labs/core-kit";
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";

const board = new Board({
	title: "Hacker News"
});
const firebase = board.addKit(HackerNewsFirebaseKit);
const algolia = board.addKit(HackerNewsAlgoliaKit);

const topStoryIdNode = firebase.topStoryIds({
	limit: 1,
	$id: "topStoryId",
});

//////////////////////////////////////////////////

//////////////////////////////////////////////////
const listKit = board.addKit(ListKit);
const getStoryFromId = algolia.getStory({
	$id: "getStoryFromId",
});

const popStory = listKit.pop({
	$id: "popStoryId",
});
topStoryIdNode.wire("storyIds->list", popStory);
popStory.wire("->list", popStory);
popStory.wire("item->id", getStoryFromId);

const core = board.addKit(Core);
//////////////////////////////////////////////////
const objectKit = board.addKit(ObjectKit);
//////////////////////////////////////////////////
//////////////////////////////////////////////////

const storyId = board.input({
	$id: "storyId",
});
storyId.wire("storyId->id", getStoryFromId);
const popChildren = listKit.pop({
	$id: "popChildren",
});
getStoryFromId.wire("children->list", popChildren);

const story = core.passthrough({
	$id: "story",
});

getStoryFromId.wire("*", story);
const storyData = core.passthrough();
// story.wire("*", storyData);
story.wire("->story_id", storyData);
story.wire("->title", storyData);
story.wire("->url", storyData);
story.wire("->points", storyData);
story.wire("->author", storyData);
story.wire("->created_at", storyData);

const storyOutput = board.output({
	$id: "storyOutput",
});

storyData.wire("*", storyOutput);
////////////////////////////////////////////////////////////////////////////////

const claude = board.addKit(ClaudeKit);
const config = board.addKit(ConfigKit);

const claudeApiKey = config.readEnvVar({
	key: "CLAUDE_API_KEY",
});
const completion = claude.generateCompletion();
claudeApiKey.wire("CLAUDE_API_KEY", completion);

////////////////////////////////////////////////////////////////////////////////

const string = board.addKit(StringKit);
const titleTemplate = string.template({
	$id: "titleTemplate",
	template: [
		"Rewrite this title",
		"\"{{title}}\"",
	].join("\n"),
});
story.wire("title", titleTemplate);

titleTemplate.wire(
	"string",
	board.output({
		$id: "populatedTemplate",
	})
);

titleTemplate.wire("string->text", completion);
completion.wire(
	"completion",
	board.output({
		$id: "rewriteTitle",
	})
);

////////////////////////////////////////////////////////////////////////////////

const nest = objectKit.nest({
	key: "post",
});
story.wire("*", nest);
const jsonKit = board.addKit(JsonKit);

const limit = objectKit.limitDepth({
	depth: 10,
});
nest.wire("post->object", limit);
limit.wire(
	"object",
	board.output({
		$id: "truncatePost",
	})
);
const stringify = jsonKit.stringify();
limit.wire("object", stringify);
stringify.wire("*", board.output({$id: "stringifiedPost"}));
const instruction = "Summarise the discussion regarding this post";

const postContentTemplate = string.template({
	$id: "postContentTemplate",
	template: [
		instruction,
		"```json",
		"{{post}}",
		"```"
	].join("\n"),
});

// const instructionNode = board.input({
// 	$id: "instruction",
// 	instruction
// });

// instructionNode.wire("instruction", postContentTemplate);

stringify.wire("string->post", postContentTemplate);
postContentTemplate.wire(
	"string",
	board.output({
		$id: "populatedPostTemplate",
	})
);

const postContentCompletion = claude.generateCompletion({
	$id: "claudePostContentCompletion",
});
claudeApiKey.wire("CLAUDE_API_KEY", postContentCompletion);

postContentTemplate.wire("string->text", postContentCompletion);
postContentCompletion.wire(
	"$error",
	board.output({
		$id: "postContentError",
	})
);
postContentCompletion.wire(
	"completion",
	board.output({
		$id: "postContentResponse",
	})
);

////////////////////////////////////////////////////////////////////////////////

popChildren.wire("->list", popChildren);
popChildren.wire("children->list", popChildren);
const comment = core.passthrough({
	$id: "comment",
});
popChildren.wire("item->comment", comment);
comment.wire("children->list", popChildren);

const spread = objectKit.spread({
	$id: "spreadComment",
});
comment.wire("comment->object", spread);
spread.wire("children->list", popChildren);
spread.wire("*", board.output({$id: "fullCommentData"}));

const commentData = core.passthrough({
	$id: "commentData",
});
spread.wire("text", commentData);
spread.wire("id", commentData);
spread.wire("story_id", commentData);

commentData.wire("*",
	board.output({
		$id: "commentOutput",
	})
);

//////////////////////////////////////////////////

util.files.makeMarkdown({
	board,
	filename: "README",
	title: "Hacker News",
	dir: ".",
	markdownConfig: [
		MarkdownContentType.mermaid,
		MarkdownContentType.json
	]
})

const suppressedOutputIds = [
	"commentOutput",
	"fullCommentData"
]

for await (const run of board.run({
	// probe: new LogProbe(),
})) {
	// if (run.type == "input") {
	// if (run.node.id == "storyId") {
	// 	run.inputs = {
	// 		storyId: 38241304,
	// 	};
	// }
	// }
	if (run.type == "output") {
		if (suppressedOutputIds.includes(run.node.id)) {
			continue;
		}
		console.log(run.node.id, run.outputs);
	}
}
