// import { useContext, createContext } from "react";
// import axios from "axios";

// const defaulTextValue = {
//   sendText: (recipient) => {
//     const textmessage = "A Shift is available! Would you like to take it? Reply YES or NO";
//     axios
//       .get(
//         `http://localhost:3000/send-text?recipient=${recipient}&textmessage=${textmessage}`
//       )
//       .catch(err => console.log(err));
//   }
// };
// const textContext = createContext(defaulTextValue);

// export const useText = () => {
//   return useContext(textContext);
// };
