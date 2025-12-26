import { describe, expect, test } from "bun:test";
import { ChatSchema } from "@/schemas/chat";

describe("ChatSchema", () => {
    test("Happy payload", () => {
        const payload = {
            uuid: "b498bf78-ad01-47a4-99c6-4f11f4dd576e",
            name: "String literal type constraints in TypeScript",
            summary: "",
            model: null,
            created_at: "2025-12-24T05:11:47.698718+00:00",
            updated_at: "2025-12-24T06:24:16.373228+00:00",
            settings: {
                enabled_bananagrams: null,
                enabled_web_search: true,
                enabled_compass: null,
                enabled_sourdough: null,
                enabled_foccacia: null,
                enabled_mcp_tools: null,
                compass_mode: null,
                paprika_mode: null,
                enabled_monkeys_in_a_barrel: true,
                enabled_saffron: false,
                create_mode: null,
                has_sensitive_data: null,
                preview_feature_uses_artifacts: true,
                preview_feature_uses_latex: null,
                preview_feature_uses_citations: null,
                enabled_drive_search: null,
                enabled_artifacts_attachments: false,
                enabled_turmeric: true,
            },
            is_starred: false,
            is_temporary: false,
            project_uuid: null,
            session_id: null,
            platform: "CLAUDE_AI",
            current_leaf_message_uuid: "019b4f07-6b84-74a7-815d-69711af1abf7",
            user_uuid: null,
            project: null,
        };

        const parsed = ChatSchema.safeParse(payload);
        expect(parsed.success).toBe(true);
    });
});
