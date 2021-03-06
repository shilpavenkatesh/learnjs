import React, { useState } from "react";

function SynomousFetching() {
  const [post, setPost] = useState([]);
  const [source, setSource] = useState("");
  const [dictionaryapicheck, setDictionaryapicheck] = useState(true);
  const [datamusecheck, setDatamusecheck] = useState(true);
  const [inputText, setinputText] = useState("");
  const [error, setError] = useState("");

  let isDictRespone = false;

  const getDataMuseAPI = (searchString) => {
    fetch(`https://api.datamuse.com/words?rel_syn=${searchString}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isDictRespone) {
          if (!data.length) {
            setError(
              "Sorry, we couldn't find synonyms for the word you were looking for."
            );
            setPost([]);
            setSource("");
          } else if (data.length !== 0) {
            setPost(data.map((item) => item.word));

            setSource("From Datamuse API");
            setError("");

            isDictRespone = true;
          } else {
            setPost([]);
            setError(
              "Sorry, we couldn't find synonyms for the word you were looking for."
            );
          }

          console.log(data);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const getDictionaryAPI = (searchString) => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchString}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isDictRespone) {
          if (data.message) {
            setError(
              "Sorry, we couldn't find synonyms for the word you were looking for."
            );
            setPost([]);
            setSource("");
          } else if (data[0].meanings[0].definitions[0].synonyms) {
            setPost(data[0].meanings[0].definitions[0].synonyms);
            setSource("From Dictionary API");
            setError("");

            isDictRespone = true;
          } else {
            setPost([]);
            setError(
              "Sorry, we couldn't find synonyms for the word you were looking for."
            );
          }
        }
      });
  };

  const handleClick = (searchString) => {
    if (!inputText) {
      setError("Please Enter a Word!!");
      setPost([]);
      setSource("");
      return;
    } else if (!dictionaryapicheck && !datamusecheck) {
      setError("Please check any source!!");
      setPost([]);
      setSource("");
      return;
    }

    if (datamusecheck) {
      getDataMuseAPI(searchString);
    }
    if (dictionaryapicheck) {
      getDictionaryAPI(searchString);
    }
  };

  return (
    <div className="bodywrap">
      <div className="header">
        <img
          src="https://gos3.ibcdn.com/ingo_logo-1605859583.png"
          alt="ingologo"
          width="40px"
          height="40px"
        />
        <h2>Synonyms Dictionary</h2>
      </div>
      <div className="error">{error}</div>

      <div className="fetchwrap">
        <div className="findwrap">
          <input
            className="findinput"
            type="text"
            value={inputText}
            onChange={(e) => {
              const value = e.target.value;
              setinputText(value);
            }}
            placeholder="Enter a word to search..."
          />
          <button
            className="findbutton"
            type="button"
            onClick={() => {
              handleClick(inputText);
            }}
          >
            Fetch synonyms
          </button>
        </div>
        <div className="inputwrap">
          <label>
            Dictionary API:{" "}
            <input
              type="checkbox"
              checked={dictionaryapicheck}
              onChange={(e) => setDictionaryapicheck(!dictionaryapicheck)}
            />
          </label>
          <label>
            Datamuse API:{" "}
            <input
              type="checkbox"
              checked={datamusecheck}
              onChange={(e) => setDatamusecheck(!datamusecheck)}
            />
          </label>
        </div>
      </div>

      {post.length !== 0 && (
        <div className="resultwrap">
          <p>Display Result</p>
          <div className="source">{source}</div>

          <div className="post" style={{ margin: "10px" }}>
            {post.map((data) => {
              return (
                <span
                  type="button"
                  onClick={() => {
                    setinputText(data);
                    handleClick(data);
                  }}
                >
                  {data}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SynomousFetching;
