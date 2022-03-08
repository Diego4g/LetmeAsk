import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

export function useRoom(roomId: string) {

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    //once é o evento de ouvir uma vez, on é o evento de ficar ouvindo, no caso abaixo estamos ouvindo o 'value'
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions:FirebaseQuestions  = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        }
      });
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })
  }, []);

  return { questions, title }
}