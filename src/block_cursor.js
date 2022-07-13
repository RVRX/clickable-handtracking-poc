let block_cursor = null;

export function InitializeBlockCursor() {
    // This element will be moved across the screen by hand movements.
    block_cursor = document.createElement('div');
    block_cursor.style.width = '20px';
    block_cursor.style.height = '20px';
    block_cursor.style.backgroundColor = 'blue';
    block_cursor.style.position = 'fixed';
    block_cursor.style.top = '100px';
    block_cursor.style.left = '100px';
    document.body.appendChild(block_cursor);
}

export function SetBlockCursorVisibility(visible) {
    if (!visible) {
        // block_cursor.style.display = 'none';
    } else {
        block_cursor.style.display = 'block';
    }
}

export function SetBlockCursorColor(color) {
    block_cursor.style.backgroundColor = color;
}

export function SetBlockCursorPosition(left, top) {
    block_cursor.style.top = window.innerHeight * top + 'px';
    block_cursor.style.left = window.innerWidth * left + 'px';
}

export function SimulateClick() {
    SetBlockCursorColor('green');
    let block_cursor_props = block_cursor.getBoundingClientRect();
    document.elementFromPoint(block_cursor_props.x, block_cursor_props.y).click();
}

export function SetBlockCursorPositionAndSimulateClick(left, top) {
    block_cursor.style.top = window.innerHeight * top + 'px';
    block_cursor.style.left = window.innerWidth * left + 'px';

    let block_cursor_props = block_cursor.getBoundingClientRect();

    document.elementFromPoint(block_cursor_props.x, block_cursor_props.y).click();
}
