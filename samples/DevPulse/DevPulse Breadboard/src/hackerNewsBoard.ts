import {
	ConfigKit,
	HackerNewsAlgoliaKit,
	HackerNewsFirebaseKit,
	JsonKit,
	ListKit,
	ObjectKit,
	StringKit
} from "@exadev/breadboard-kits";
import { Board } from "@google-labs/breadboard";
import Core from "@google-labs/core-kit";
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";

const hackerNewsBoard = new Board({
	title: "Hacker News"
});
type hackerNewsBoard = typeof hackerNewsBoard;
export { hackerNewsBoard }
export default hackerNewsBoard;

const firebase = hackerNewsBoard.addKit(HackerNewsFirebaseKit);
const algolia = hackerNewsBoard.addKit(HackerNewsAlgoliaKit);

const topStoryIdNode = firebase.topStoryIds({
	limit: 1,
	$id: "topStoryId",
});

//////////////////////////////////////////////////

//////////////////////////////////////////////////
const listKit = hackerNewsBoard.addKit(ListKit);
const getStoryFromId = algolia.getStory({
	$id: "getStoryFromId",
});

const popStory = listKit.pop({
	$id: "popStoryId",
});
topStoryIdNode.wire("storyIds->list", popStory);
popStory.wire("->list", popStory);
popStory.wire("item->id", getStoryFromId);

const core = hackerNewsBoard.addKit(Core);
//////////////////////////////////////////////////
const objectKit = hackerNewsBoard.addKit(ObjectKit);
//////////////////////////////////////////////////
//////////////////////////////////////////////////

const storyId = hackerNewsBoard.input({
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

const storyOutput = hackerNewsBoard.output({
	$id: "storyOutput",
});

storyData.wire("*", storyOutput);
////////////////////////////////////////////////////////////////////////////////

const claude = hackerNewsBoard.addKit(ClaudeKit);
const config = hackerNewsBoard.addKit(ConfigKit);

const claudeApiKey = config.readEnvVar({
	key: "CLAUDE_API_KEY",
});
const completion = claude.generateCompletion();
claudeApiKey.wire("CLAUDE_API_KEY", completion);

////////////////////////////////////////////////////////////////////////////////

const string = hackerNewsBoard.addKit(StringKit);
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
	hackerNewsBoard.output({
		$id: "populatedTemplate",
	})
);

titleTemplate.wire("string->text", completion);
completion.wire(
	"completion",
	hackerNewsBoard.output({
		$id: "rewriteTitle",
	})
);

////////////////////////////////////////////////////////////////////////////////

const nest = objectKit.nest({
	key: "post",
});
story.wire("*", nest);
const jsonKit = hackerNewsBoard.addKit(JsonKit);

const limit = objectKit.limitDepth({
	depth: 10,
});
nest.wire("post->object", limit);
limit.wire(
	"object",
	hackerNewsBoard.output({
		$id: "truncatePost",
	})
);
const stringify = jsonKit.stringify();
limit.wire("object", stringify);
stringify.wire("*", hackerNewsBoard.output({$id: "stringifiedPost"}));
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

stringify.wire("string->post", postContentTemplate);
postContentTemplate.wire(
	"string",
	hackerNewsBoard.output({
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
	hackerNewsBoard.output({
		$id: "postContentError",
	})
);
postContentCompletion.wire(
	"completion",
	hackerNewsBoard.output({
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
spread.wire("*", hackerNewsBoard.output({$id: "fullCommentData"}));

const commentData = core.passthrough({
	$id: "commentData",
});
spread.wire("text", commentData);
spread.wire("id", commentData);
spread.wire("story_id", commentData);

commentData.wire("*",
	hackerNewsBoard.output({
		$id: "commentOutput",
	})
);