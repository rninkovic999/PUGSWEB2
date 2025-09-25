const formatAnswer = (answer, question) => {
  if (answer === undefined || answer === null) return "Not answered";

  switch (question.type) {
    case "SingleChoice": {
      const index = answer - 1;
      if (
        typeof index !== "number" ||
        !question.options ||
        index < 0 ||
        index >= question.options.length
      ) {
        return `[invalid index: ${answer}]`;
      }
      return question.options[index];
    }

    case "MultipleChoice":
      if (!Array.isArray(answer)) return "[invalid format]";
      return answer
        .map((i) => {
          const index = i - 1;
          return question.options &&
            index >= 0 &&
            index < question.options.length
            ? question.options[index]
            : `[?${i}]`;
        })
        .join(", ");

    case "TrueFalse":
      return answer === true || answer === "true" ? "True" : "False";

    case "FillInTheBlank":
      return String(answer);

    default:
      return String(answer);
  }
};

export default formatAnswer;
