import React from "react";
import { useParams } from "react-router-dom";
import ResultsDetails from "../components/ResultsDetails/ResultsDetails";

const ResultsDetailsPage = () => {
  const { id } = useParams();
  return (
    <>
      <ResultsDetails resultId={id} />
    </>
  );
};

export default ResultsDetailsPage;
