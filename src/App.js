import { useCallback, useEffect, useRef, useState } from "react";
import { TreeMapGroup } from "./components/TreeMap";

import "./App.css"; // Don't forget to port this css file too, if you want the resize and styles to work correctly.

// ************************ JSDoc Types ************************

/**
 * @typedef IPFSResponse
 * @property {Array<IPFSFileEntry>} Entries
 */

/**
 * @typedef IPFSFileEntry
 * @property {string} Hash
 * @property {string} Name
 * @property {number} Size
 * @property {number} Type
 */

// Note: Remove mock data if it is not needed.

/**
 * @type {IFPSResponse}
 */
// const mockIPFSResponse = {
//   Entries: [
//     {
//       Hash: "QmcAm5PngkrfB5Ajea5kKAWE5d6VSpKKTYaKZNULgAPXWv",
//       Name: "first.png",
//       Size: 768403,
//       Type: 0,
//     },
//     {
//       Hash: "QmcAm5PngkrfB5Ajea5kKAWE5d6VSpKKTYaKZNULgAPXWv",
//       Name: "second.jpeg",
//       Size: 0,
//       Type: 0,
//     },
//     {
//       Hash: "QmcAm5PngkrfB5Ajea5kKAWE5d6VSpKKTYaKZNULgAPXWv",
//       Name: "third.pdf",
//       Size: 1768403,
//       Type: 0,
//     },
//     {
//       Hash: "QmcAm5PngkrfB5Ajea5kKAWE5d6VSpKKTYaKZNULgAPXWv",
//       Name: "folder",
//       Size: 3768403,
//       Type: 0,
//     },
//     {
//       Hash: "QmcAm5PngkrfB5Ajea5kKAWE5d6VSpKKTYaKZNULgAPXWv",
//       Name: "folder2",
//       Size: 3768403,
//       Type: 0,
//     },
//     {
//       Hash: "QmcAm5PngkrfB5Ajea5kKAWE5d6VSpKKTYaKZNULgAPXWv",
//       Name: "file.jpeg",
//       Size: 3768403,
//       Type: 0,
//     },
//     {
//       Hash: "QmcAm5PngkrfB5Ajea5kKAWE5d6VSpKKTYaKZNULgAPXWv",
//       Name: "file.pdf",
//       Size: 1768403,
//       Type: 0,
//     },
//   ],
// };

// ************************ Graph Utility ************************
// NOTE: This section should be moved to utility file for cleaner code.

/**
 * @param {Response} response
 * @description Returns a json parsed promise if the response succeeds, otherwise throws an error with status text.
 */
function fetchJSONHandler(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
}

/**
 * @description Debounces function
 *
 * Note: This is needed in code to debounce resize event.
 */
function debounce(func) {
    let timer;
    return function (...args) {
        const context = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            func.apply(context, args);
        }, 500);
    };
}

/**
 * @param {IPFSResponse} data
 * @returns {{ children: Array }}
 */
const transformIPFSResponse = (data) => {
    const entries = data?.Entries;

    if (!entries || entries.length === 0) {
        return { children: [] };
    }

    // We are given data for some node, therefore construct children for it from the given entries.
    const children = entries
        .filter((entry) => entry.Size !== 0)
        .map((entry) => ({
            name: entry.Name,
            value: entry.Size,
        }));

    return { children };
};

function App() {
    // IPFS Response data
    /** @type {[IPFSResponse, React.Dispatch<IPFSResponse>]} */
    const [IPFSFiles, setIPFSFiles] = useState(null);

    // Keeps track of current dimensions for the graph for the d3's tree-graph.
    const [dimensions, setDimensions] = useState(null);

    // Keeps reference of the graph's container element to later use for getting size of it.
    const containerRef = useRef();

    // Logic to get the graph's container element width and height.
    const updateDimensions = useCallback(
        () =>
            debounce(() => {
                if (containerRef.current) {
                    // Set dimensions based on bounds of the parent container.
                    const { width, height } = containerRef.current.getBoundingClientRect();
                    setDimensions({ width, height });
                }
            })(), // Usecallback expects inline function, so wrapping and calling debounce ourselves.
        [containerRef]
    );

    // Update Dimensions upon mounting the component.
    useEffect(() => {
        updateDimensions();
    }, [updateDimensions]);

    // Updates the size of the graph according to the size of the window.
    useEffect(() => {
        // Debounce resize event to avoid firing too many state updates due to resize events.
        window.addEventListener("resize", updateDimensions);
        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, [updateDimensions]);

    // You can do something like this for getting data from the IPFS API.
    useEffect(() => {
        function getIPFSFiles() {
            fetch("http://127.0.0.1:5001/api/v0/files/ls?long=true", {
                method: "POST",
            })
                .then(fetchJSONHandler)
                .then((response) => setIPFSFiles(response))
                .catch(console.error);
        }
        getIPFSFiles();
    }, []);

    return (
        <div ref={containerRef} className="graph-container">
            {dimensions && ( // Remove this if you want to see the graph without resize feature.
                <TreeMapGroup
                    width={dimensions.width}
                    height={dimensions.height}
                    transform={transformIPFSResponse}
                    data={IPFSFiles} // Use this if fetching data from node.
                />
            )}
        </div>
    );
}

export default App;
