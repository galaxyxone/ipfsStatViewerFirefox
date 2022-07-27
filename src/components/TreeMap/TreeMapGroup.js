import * as d3 from "d3";
import PropTypes from "prop-types";
import { useMemo } from "react";

// ************************ JSDoc Types ************************

/**
 * @typedef TreeMapGroupProps
 * @property {number} [width]
 * @property {number} [height]
 * @property {data} data
 * @property {(d: any) => any} [transform]
 */

// ************************ Graph Config ************************ // Remove these separators when moving to your repo.
// NOTE: Move to shared config file if separating hook and component.

const DEFAULT = {
    width: 500,
    height: 500,
};

const BLOCK_GAP = 0; // Change this to update gaps between the blocks.

const BLOCK_LABEL_CONFIG = {
    xOffset: 5,
    yOffset: 20,
    fontSize: "12px",
    fill: "white",
};

const MARGIN = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
};

// Used if transform function is not provided to the component.
/**
 * @param {IPFSResponse} data
 * @returns {any}
 */
const defaultTransform = (data) => data;

// ************************ Graph Utility ************************
// NOTE: This section should be moved to utility file for cleaner code.

/**
 * @param {string} filename
 * @description Returns a color based on the extension of the filename.
 */
function getBlockColorFromFilename(filename) {
    const extension = filename.split(".").at(-1).toLowerCase(); // Get the extension of the filename based on string after last period.
    switch (extension) {
        case "jpg":
        case "png":
        case "jpeg":
            return "#BE8C63";
        case "pdf":
            return "palevioletred";
        default:
            return "slateblue";
    }
}

// ************************ Graph Hooks ************************

/**
 * @typedef TransformedData
 * @property {any[]} children
 */

/**
 *
 * @param {any} data
 * @param {number} nodeHeight
 * @param {number} nodeWidth
 * @param {(d: any) => TransformedData} transform
 * @returns {d3.HierarchyNode} tree
 */
const useTreeNode = (data, nodeHeight, nodeWidth, transform) => {
    const tree = useMemo(() => {
        const transformedData = transform(data);
        const treeRoot = d3.hierarchy(transformedData).sum((d) => d.value / 1024); // Convert data to KiB.
        d3
            .treemap()
            .size([nodeWidth - MARGIN.left - MARGIN.right, nodeHeight - MARGIN.top - MARGIN.bottom])
            .padding(2)(treeRoot);
        return treeRoot;
    }, [data, nodeHeight, nodeWidth, transform]);

    return tree;
};

// ************************ Graph Component ************************

/**
 * @param {TreeMapGroupProps} props
 * @returns {JSX.Element}
 */
function TreeMapGroup({
    transform = defaultTransform,
    width = DEFAULT.width,
    height = DEFAULT.height,
    data,
    ...otherProps
}) {
    const tree = useTreeNode(data, height, width, transform);

    return (
        tree.data.children.length !== 0 && (
            <svg
                width={width + MARGIN.left + MARGIN.right}
                height={height + MARGIN.top + MARGIN.bottom}>
                <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
                    {/* Render data Blocks */}
                    <g>
                        {tree.leaves().map((leaf) => (
                            <rect
                                key={leaf.data.name}
                                x={leaf.x0}
                                y={leaf.y0}
                                width={leaf.x1 - leaf.x0 - BLOCK_GAP}
                                height={leaf.y1 - leaf.y0 - BLOCK_GAP}
                                stroke="black"
                                fill={getBlockColorFromFilename(leaf.data.name)}
                            />
                        ))}
                    </g>
                    {/* Render block labels */}
                    <g>
                        {tree.leaves().map((leaf) => (
                            <text
                                key={leaf.data.name}
                                x={leaf.x0 + BLOCK_LABEL_CONFIG.xOffset}
                                y={leaf.y0 + BLOCK_LABEL_CONFIG.yOffset}
                                fontSize={BLOCK_LABEL_CONFIG.fontSize}
                                fill={BLOCK_LABEL_CONFIG.fill}>
                                {leaf.data.name}
                            </text>
                        ))}
                    </g>
                </g>
            </svg>
        )
    );
}

TreeMapGroup.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.object,
    transform: PropTypes.func,
};

export default TreeMapGroup;
