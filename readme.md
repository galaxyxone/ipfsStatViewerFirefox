# ipfsStatViewerFirefox

### _A simple Firefox add-on for users to visualize the data stored on their local IPFS node_

[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.io/)



## IPFS Statistical Data Viewer is a Firefox add-on that visualizes your IPFS Node with D3.js using the file_type and file_size as the sources of data to create a treemap


# Install Extension

[Download in the Firefox Add-On Store](https://addons.mozilla.org/en-US/firefox/addon/ipfs-stat-viewer/)

Important Note: You need to make sure you have cross origin requests allowed. You can use the following ipfs cli-commands to enable cross origin access. 

If 
If you want to install from source via this repo, do the following-

- Download the build file and load it as unpacked in Chrome Extension Manager
- Open extension with your IPFS Daemon running



```sh
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST"]'
```
As as you have IPFS running, it should work without issue-

(update screenshot with Firefox version)

- You should see something that looks like this depending on what you have pinned in IPFS

## Features
- Color the rectangle in the treemap correlates to the file type. (Supports music, photos, video, software meme_types) 
- The size of the rectangle correlates to the file size of the data stored on a users local IPFS node.  

## Tech

 A users IPFS data is visualized using organized colorful graphics similar to apps like Windirstat, or Disk Recon. Each file type (MP3, ZIP, EXE, JPEG, etc.) is assigned a color in a collage of rectangles that are sized depending on how much space that file type is using. Treemap function provided by D3.js.  

- [IPFS] - Peer-to-peer hypermedia protocol
- [D3] - A Javascript library for visualizing data using web standards-
- [markdown-it] - Markdown parser done right. Fast and easy to extend.
- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework [@tjholowaychuk]

## Sudo way

```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin ‘[“http://webui.ipfs.io.ipns.localhost:48084”, “http://localhost:3000”, “http://127.0.0.1:5001”, “https://webui.ipfs.io”, “chrome-extension://*“]’
```



### In specific cases, this command is needed to get the treemap to function correctly(still figuring out a better solution)

```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://webui.ipfs.io.ipns.localhost:48084", "http://localhost:3000", "http://127.0.0.1:5001", "https://webui.ipfs.io", "chrome-extension://leoogniilogpecgamlbafoajfcaoddja"]'
```

## Future 

- FUTURE: Add more visualizations (pie chart and more)
- FUTURE: More supported file extensions
- FUTURE: Pie-chart added visualization with file extensions pinned


## License

MIT
