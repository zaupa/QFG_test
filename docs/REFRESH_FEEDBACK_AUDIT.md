# V30.0.1 refresh feedback

The user subsequently confirmed they edited public/data while running preview, which serves dist/data. Rebuilding or copying the updated source JSON into dist/data resolved the issue. Existing network refresh checks pass. Preview serves dist/data, while development serves public/data; an installed offline app cannot read changed local files without its server running. Active snapshots and Custom definitions are separate from shared JSON updates.

The refresh path previously hid the specific loading/validation error, and reported success even when the supported definitions were unchanged. The repair labels fetch/parse/validation errors with their source filename, preserves the last valid bundle, reports unchanged supported definitions with the served data URL, and checks the replacement result before reporting application. It does not implement the pending completionFateReward feature or change JSON data.

Verification: 37 platform checks, three item-refresh checks and the actual stopped-server regression passed (41 total). Raw results and final artifact hashes are retained in docs/validation/refresh-feedback-results.json. Type-check/build and whitespace checks passed. This is targeted verification rather than a full gameplay rerun. No changes have been pushed.
