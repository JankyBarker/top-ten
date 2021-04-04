import React, { useState } from "react";
import "./Board.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const finalSpaceCharacters = [
  {
    id: "gary",
    name: "Gary Goodspeed",
    thumb: "/images/gary.png",
    ord: 0,
  },
  {
    id: "cato",
    name: "Little Cato",
    thumb: "/images/cato.png",
    ord: 1,
  },
  {
    id: "kvn",
    name: "KVN",
    thumb: "/images/kvn.png",
    ord: 2,
  },
  {
    id: "mooncake",
    name: "Mooncake",
    thumb: "/images/mooncake.png",
    ord: 3,
  },
  {
    id: "quinn",
    name: "Quinn Ergon",
    thumb: "/images/quinn.png",
    ord: 4,
  },
];

function BoardPage() {
  const [characters, updateCharacters] = useState(finalSpaceCharacters);

  characters.sort(function (a, b) {
    return a.ord - b.ord;
  });

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(characters);

    const sourceItem = items[result.source.index];
    const destItem = items[result.destination.index];

    const sourceOrder = sourceItem.ord;
    const destOrder = destItem.ord;

    sourceItem.ord = destOrder;
    destItem.ord = sourceOrder;

    items.sort(function (a, b) {
      return a.ord - b.ord;
    });

    updateCharacters(items);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Top Ten</h1>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className="characters"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {characters.map(({ id, name, thumb, ord }) => {
                  return (
                    <Draggable key={id} draggableId={id} index={ord}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="characters-thumb">
                            <img src={thumb} alt={`${name} Thumb`} />
                          </div>
                          <p>{name}</p>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </header>
      <p>
        Images from{" "}
        <a href="https://final-space.fandom.com/wiki/Final_Space_Wiki">
          Final Space Wiki
        </a>
      </p>
    </div>
  );
}

export default BoardPage;
