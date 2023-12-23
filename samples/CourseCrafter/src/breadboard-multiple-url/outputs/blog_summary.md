 Here are the outlined topics and code samples for each blog post:

## Blog 1: Scheduler API origin trial

- Yielding control back to main thread with `scheduler.yield()` to improve input responsiveness

```js
// Yield with scheduler.yield
async function yieldy() {
  await scheduler.yield(); 
}
```

- `scheduler.yield()` sends remaining work to front of task queue 

```js
async function doWork() {
  await yieldToMain();

  // Remaining work
}

function yieldToMain() {
  if ('scheduler' in window && 'yield' in scheduler) {
    return scheduler.yield();
  }
}  
```

## Blog 2: Automatic picture-in-picture 

- Register media session action handler for `enterpictureinpicture` 

```js
navigator.mediaSession.setActionHandler("enterpictureinpicture", () => {
  video.requestPictureInPicture(); 
});
```

- Use Document Picture-in-Picture API to populate custom HTML

```js 
navigator.mediaSession.setActionHandler("enterpictureinpicture", async () => {
  const pipWindow = await documentPictureInPicture.requestWindow();  
  // Populate HTML  
});
```

## Blog 3: 16-bit floats in WebGPU/WGSL

- Enable `f16` WGSL extension

```wgsl
enable f16;

const c: vec3<f16> = ...;
```

- Conditionally use `f16` or `f32` based on GPU feature support 

```js
const hasShaderF16 = adapter.features.has("shader-f16");

const header = hasShaderF16  
  ? `enable f16; alias min16float = f16;`
  : `alias min16float = f32;`;

const c = vec3<min16float>(...); 
```