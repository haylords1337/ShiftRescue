import React, { Component } from "react";

export class TextForm extends Component {
  state = {
    text: {
      recipient: "",
      textmessage: ""
    }
  };

  sendText = _ => {
    const { text } = this.state;
    fetch(
      `http://localhost:3000/send-text?recipient=${text.recipient}&textmessage=${text.textmessage}`
    ).catch(err => console.log(err));
  };

  render() {
    const { text } = this.state;
    const spacer = {
      margin: 8
    };
    const textArea = {
      borderRadius: 4
    };

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div style={{ marginTop: 10 }}>
          <h2> Send Text Message </h2>
          <label> Your Phone Number </label>
          <br />
          <input
            value={text.recipient}
            onChange={e =>
              this.setState({ text: { ...text, recipient: e.target.value } })
            }
          />
          <div style={spacer} />
          <label> Message </label>
          <br />
          <textarea
            rows={3}
            value={text.textmessage}
            style={textArea}
            onChange={e =>
              this.setState({ text: { ...text, textmessage: e.target.value } })
            }
          />
          <div style={spacer} />
          <button
            onClick={() => {
              const { text } = this.state;
              fetch(
                `http://localhost:3000/send-text?recipient=${text.recipient}&textmessage=${text.textmessage}`
              ).catch(err => console.log(err));
            }}
          >
            Send Text
          </button>
        </div>
      </div>
    );
  }
}
