import type { Vote } from "opnvote/votingSystem/dist/index.js";

export interface Question {
  text: string;
  imageUrl: string;
  [key: string]: any;
}

export interface ElectionDescription {
  title: string;
  headerImage: {
    large: string;
    small: string;
    [key: string]: any;
  };
  description: string;
  summary: string;
  questions: Question[];
  backLink: string;
  registrationStartTime: number;
  registrationEndTime: number;
  [key: string]: any;
}

export interface DecodedBallot {
  votes: Vote[];
  electionID?: number;
  voterAddress?: string;
  electionDescription?: ElectionDescription;
}
