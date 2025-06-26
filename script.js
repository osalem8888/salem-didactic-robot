async function sendMessage() {
  const input = document.getElementById('user-input').value;
  if (!input) return;

  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML += `<div><strong>You:</strong> ${input}</div>`;

  try {
    const response = await fetch('https://forbindicatoragent.netlify.app/.netlify/functions/openai-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a research assistant specialized in analyzing large volumes of text to identify indicators related to Freedom of Religion and Belief (FoRB). You must:

- Provide concise summaries and highlight key findings.
- Identify and formulate the top 20 indicators based solely on frequency and emphasis in the input documents.
- Evaluate each indicator using SMART and SPICED frameworks.
- Classify each indicator as Output (numerical) or Outcome (change-based).
- Indicate whether each indicator aligns with OHCHR global FoRB frameworks — but only if cited in the document.

Rules:
1. Strictly derive indicators from the provided text. Do not infer or synthesize from general knowledge.
2. Do not use external frameworks unless quoted in the text.
3. Respect participant phrasing in participatory or ethnographic content.
4. Assign a verifiability rating to each indicator:
   - High = direct quote
   - Moderate = paraphrased, clearly attributable
   - Low = inferred (do not include)
5. Only return indicators rated High or Moderate.

If no indicators can be extracted, explain why. If indicators are vague, ask the user for more data. Where appropriate, suggest SMART/SPICED refinements without altering the original meaning.`
          },
          { role: 'user', content: input }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
    chatBox.innerHTML += `<div><strong>FoRB Agent:</strong> ${reply}</div>`;
    document.getElementById('user-input').value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    chatBox.innerHTML += `<div style='color: red;'><strong>Error:</strong> ${error.message}</div>`;
  }
}
