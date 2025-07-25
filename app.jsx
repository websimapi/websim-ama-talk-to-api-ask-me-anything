import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
const room = new WebsimSocket();
function AMAApp() {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState({});
  const [creator, setCreator] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const loadUsers = async () => {
      const creatorData = await window.websim.getCreator();
      const currentUserData = await window.websim.getCurrentUser();
      setCreator(creatorData);
      setCurrentUser(currentUserData);
    };
    loadUsers();
  }, []);
  const { data: questionsData, loading: loadingQuestions } = useQuery(
    room.query(`
      WITH vote_counts AS (
        SELECT 
          q.id,
          q.question,
          q.author_username,
          q.created_at,
          q.user_id as author_id,
          COUNT(CASE WHEN v.vote_type = 'up' THEN 1 END) as upvotes,
          COUNT(CASE WHEN v.vote_type = 'down' THEN 1 END) as downvotes
        FROM public.questions q
        LEFT JOIN public.votes v ON q.id = v.question_id
        GROUP BY q.id, q.question, q.author_username, q.created_at, q.user_id
      )
      SELECT * FROM vote_counts ORDER BY (upvotes - downvotes) DESC, created_at DESC
    `)
  );
  const questions = questionsData || [];
  const { data: votes, loading: loadingVotes } = useQuery(
    room.collection("votes").getList()
  );
  const { data: answers, loading: loadingAnswers } = useQuery(
    room.collection("answers").getList()
  );
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    await room.collection("questions").create({
      question: newQuestion,
      author_username: currentUser?.username || "anonymous",
      user_id: currentUser?.id || "anonymous"
    });
    setNewQuestion("");
  };
  const handleVote = async (questionId, voteType) => {
    if (!currentUser) {
      alert("Please sign in to vote");
      return;
    }
    await room.collection("votes").upsert({
      id: `${currentUser.id}-${questionId}`,
      question_id: questionId,
      user_id: currentUser.id,
      vote_type: voteType
    });
  };
  const handleAnswer = async (questionId) => {
    if (!creator || !currentUser || currentUser.id !== creator.id) {
      alert("Only the creator can answer questions");
      return;
    }
    const answerText = newAnswer[questionId];
    if (!answerText?.trim()) return;
    await room.collection("answers").create({
      question_id: questionId,
      answer: answerText,
      user_id: currentUser.id,
      username: currentUser.username
    });
    setNewAnswer((prev) => ({ ...prev, [questionId]: "" }));
  };
  const getUserVote = (questionId) => {
    if (!currentUser || !votes) return null;
    const vote = votes.find((v) => v.question_id === questionId && v.user_id === currentUser.id);
    return vote?.vote_type;
  };
  if (loadingQuestions || loadingVotes || loadingAnswers) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gray-900 text-white flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "text-xl", children: "Loading questions..." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 109,
      columnNumber: 7
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 108,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gray-900 text-white", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxDEV("header", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl font-bold mb-2", children: [
        "[AMA] Talk to @",
        creator?.username || "api"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 117,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-400 text-lg", children: "Ask me anything! I'll do my best to answer." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 118,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 116,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "mb-8", children: /* @__PURE__ */ jsxDEV("form", { onSubmit: handleQuestionSubmit, className: "mb-6", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800 rounded-lg p-6", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-semibold mb-4", children: "Ask a Question" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 124,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(
        "textarea",
        {
          value: newQuestion,
          onChange: (e) => setNewQuestion(e.target.value),
          placeholder: "What would you like to ask?",
          className: "w-full px-4 py-3 bg-gray-700 rounded-md text-white placeholder-gray-400 resize-none",
          rows: "3"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 125,
          columnNumber: 15
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "submit",
          className: "mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition duration-200",
          children: "Submit Question"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 132,
          columnNumber: 15
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 123,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 122,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 121,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold mb-4", children: "Questions" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 143,
        columnNumber: 11
      }, this),
      questions.map((question) => {
        const score = (question.upvotes || 0) - (question.downvotes || 0);
        const userVote = getUserVote(question.id);
        const questionAnswers = answers?.filter((a) => a.question_id === question.id) || [];
        return /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800 rounded-lg p-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-gray-100 text-lg mb-2", children: question.question }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 153,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-400", children: [
                "asked by ",
                /* @__PURE__ */ jsxDEV("span", { className: "font-medium", children: [
                  "@",
                  question.author_username || "anonymous"
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 155,
                  columnNumber: 32
                }, this),
                " \u2022 ",
                new Date(question.created_at).toLocaleDateString()
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 154,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 152,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2 ml-4", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handleVote(question.id, "up"),
                  className: `p-2 rounded ${userVote === "up" ? "bg-green-700" : "bg-gray-700 hover:bg-gray-600"}`,
                  disabled: !currentUser,
                  children: [
                    "\u2191 ",
                    question.upvotes || 0
                  ]
                },
                void 0,
                true,
                {
                  fileName: "<stdin>",
                  lineNumber: 159,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handleVote(question.id, "down"),
                  className: `p-2 rounded ${userVote === "down" ? "bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`,
                  disabled: !currentUser,
                  children: [
                    "\u2193 ",
                    question.downvotes || 0
                  ]
                },
                void 0,
                true,
                {
                  fileName: "<stdin>",
                  lineNumber: 166,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("span", { className: "ml-2 font-bold text-lg", children: score }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 173,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 158,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 151,
            columnNumber: 17
          }, this),
          questionAnswers.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "border-t border-gray-700 pt-4", children: [
            /* @__PURE__ */ jsxDEV("h4", { className: "text-md font-semibold mb-3", children: [
              "Answer from @",
              creator?.username,
              ":"
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 179,
              columnNumber: 21
            }, this),
            questionAnswers.map((answer) => /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-700 p-4 rounded-md mb-2", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-gray-200", children: answer.answer }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 182,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-2", children: [
                "answered on ",
                new Date(answer.created_at).toLocaleDateString()
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 183,
                columnNumber: 25
              }, this)
            ] }, answer.id, true, {
              fileName: "<stdin>",
              lineNumber: 181,
              columnNumber: 23
            }, this))
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 178,
            columnNumber: 19
          }, this) : creator && creator.username === currentUser?.username && /* @__PURE__ */ jsxDEV("div", { className: "border-t border-gray-700 pt-4", children: /* @__PURE__ */ jsxDEV("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxDEV(
              "textarea",
              {
                value: newAnswer[question.id] || "",
                onChange: (e) => setNewAnswer((prev) => ({ ...prev, [question.id]: e.target.value })),
                placeholder: "Write your answer...",
                className: "w-full px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 resize-none",
                rows: "3"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 192,
                columnNumber: 23
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => handleAnswer(question.id),
                className: "mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition duration-200",
                children: "Post Answer"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 199,
                columnNumber: 23
              },
              this
            )
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 191,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 190,
            columnNumber: 19
          }, this)
        ] }, question.id, true, {
          fileName: "<stdin>",
          lineNumber: 150,
          columnNumber: 15
        }, this);
      }),
      questions.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxDEV("p", { className: "text-gray-400 text-lg", children: "No questions yet. Be the first to ask!" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 214,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 213,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 142,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 115,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 114,
    columnNumber: 5
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(AMAApp, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 224,
  columnNumber: 13
}));
