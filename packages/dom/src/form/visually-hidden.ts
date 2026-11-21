/**
 * The structural style of a hidden form input (spec/README.md, "Forms"): out of the layout and
 * invisible, but still a form control the browser submits and validates (unlike `display: none`).
 */
export const VISUALLY_HIDDEN_INPUT_STYLE = {
    position: "absolute",
    width: "1px",
    height: "1px",
    margin: "-1px",
    padding: "0",
    border: "0",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    pointerEvents: "none",
} as const;
