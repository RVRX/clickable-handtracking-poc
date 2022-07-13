/**
 * This is a very minimal example showcasing various features of the Yoha engine.
 * The example creates a colored box that can be moved using hand movements. Performing
 * a pinch or fist gesture changes the color of the cursor.
 */
import * as yoha from '@handtracking.io/yoha';
import { SetBlockCursorColor, SetBlockCursorPosition, SetBlockCursorVisibility, InitializeBlockCursor, SimulateClick } from './block_cursor';

async function Run() {
    // Download models.
    const modelFiles = await yoha.DownloadMultipleYohaTfjsModelBlobs(
        '/box/model.json',
        '/lan/model.json',
        (rec, total) => {
            document.body.innerText = 'Download progress: ' + (rec / total) * 100 + '%';
        }
    );

    InitializeBlockCursor();

    // Setup video feed.
    const streamRes = await yoha.CreateMaxFpsMaxResStream();
    if (streamRes.error) {
        // Non-production ready error handling...
        console.error(streamRes.error);
        return ;
    }
    const video = yoha.CreateVideoElementFromStream(streamRes.stream);

    // Note the 'wasmPath' argument. This has to be in sync with how you serve the respective
    // files. See webpack.config.js for an example.
    const wasmConfig = {
        wasmPaths: './node_modules/@tensorflow/tfjs-backend-wasm/dist/'
    };

    const thresholds = yoha.RecommendedHandPoseProbabilityThresholds;

    // Create Demo Buttons
    // Will log when "clicked" (pinch motion with hand)
    function createButton(name) {
        var button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = name;
        button.className = 'btn-styled';
        button.style.marginTop = '100px'
        button.style.padding = '100px'
        button.onclick = function () {
            console.log(name + ' clicked!');
        };
        document.body.appendChild(button);
    }
    createButton("button 1");
    createButton("button 2");
    createButton("button 3");

    // Run engine.
    // We configure small padding to avoid that users move their hand outside webcam view
    // when trying to move the cursor towards the border of the viewport.
    yoha.StartTfjsWasmEngine({padding: 0.05}, wasmConfig, video, modelFiles, res => {
        if (res.isHandPresentProb < thresholds.IS_HAND_PRESENT) {
            SetBlockCursorVisibility(false);
            return;
        }
        SetBlockCursorVisibility(true);

        // Change cursor position.
        // We only use one coordinate here...
        SetBlockCursorPosition(...res.coordinates[0]);

        // Change color depending on gesture.
        if (res.poses.fistProb > thresholds.FIST) {
            SetBlockCursorColor('red');
        } else if (res.poses.pinchProb > thresholds.PINCH) {
            SimulateClick();
        } else {
            SetBlockCursorColor('blue');
        }
    });
}

Run();

