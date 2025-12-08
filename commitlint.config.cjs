module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 사용 가능한 type 정의
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
    ],

    // type은 반드시 있어야 함 (feat, fix 등)
    "type-empty": [2, "never"],

    // subject(메시지 내용)는 비어있으면 안 됨
    "subject-empty": [2, "never"],

    // subject 마지막에 마침표(.) 금지
    "subject-full-stop": [2, "never", "."],
  },
};
