import { useState, useEffect } from "react";
import { ElementStates } from "../types/element-states";
import { IButtonsStates } from "../types/buttons-states";
import { Node } from "../data-structures/linked-list";
import { LinkedList } from "../data-structures/linked-list";

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const linkedList = new LinkedList<string>();

export const useLinkedList = (
  size: number,
): {
  head: Node<string> | null;
  listArray: {
    above: { value: string; status: ElementStates };
    under: { value: string; status: ElementStates };
    status: ElementStates;
    node: Node<string>;
  }[];
  addElementInHead: (value: string) => void;
  deleteElementFromHead: () => void;
  addElementInTail: (value: string) => void;
  deleteElementFromTail: () => void;
  addElementByIndex: (index: number, value: string) => void;
  deleteElementByIndex: (index: number) => void;
  buttonsStates: {
    addInHead: IButtonsStates;
    addInTail: IButtonsStates;
    deleteFromHead: IButtonsStates;
    deleteFromTail: IButtonsStates;
    addByIndex: IButtonsStates;
    deleteByIndex: IButtonsStates;
    valueInput: IButtonsStates;
    indexInput: IButtonsStates;
  };
} => {
  const [head, setHead] = useState<Node<string> | null>(linkedList.head);
  const [listArray, setListArray] = useState<
    {
      above: { value: string; status: ElementStates };
      under: { value: string; status: ElementStates };
      status: ElementStates;
      node: Node<string>;
    }[]
  >([]);

  const [buttonsStates, setButtonsStates] = useState<{
    addInHead: IButtonsStates;
    addInTail: IButtonsStates;
    deleteFromHead: IButtonsStates;
    deleteFromTail: IButtonsStates;
    addByIndex: IButtonsStates;
    deleteByIndex: IButtonsStates;
    valueInput: IButtonsStates;
    indexInput: IButtonsStates;
  }>({
    addInHead: IButtonsStates.Default,
    addInTail: IButtonsStates.Default,
    deleteFromHead: IButtonsStates.Default,
    deleteFromTail: IButtonsStates.Default,
    addByIndex: IButtonsStates.Default,
    deleteByIndex: IButtonsStates.Default,
    valueInput: IButtonsStates.Default,
    indexInput: IButtonsStates.Default,
  });

  useEffect(() => {
    for (let i = 1; i <= size; i++) {
      linkedList.prepend(String(getRandomInt(1, 100)));
    }

    setHead(linkedList.head);
    createVisibleArray(linkedList.head);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      createVisibleArray(linkedList.head);

      if (linkedList.size === 0) {
        setButtonsStates({
          addInHead: IButtonsStates.Default,
          addInTail: IButtonsStates.Default,
          deleteFromHead: IButtonsStates.Disabled,
          deleteFromTail: IButtonsStates.Disabled,
          addByIndex: IButtonsStates.Default,
          deleteByIndex: IButtonsStates.Disabled,
          valueInput: IButtonsStates.Default,
          indexInput: IButtonsStates.Default,
        });
      } else {
        setButtonsStates({
          addInHead: IButtonsStates.Default,
          addInTail: IButtonsStates.Default,
          deleteFromHead: IButtonsStates.Default,
          deleteFromTail: IButtonsStates.Default,
          addByIndex: IButtonsStates.Default,
          deleteByIndex: IButtonsStates.Default,
          valueInput: IButtonsStates.Default,
          indexInput: IButtonsStates.Default,
        });
      }
    }, 500);
  }, [linkedList.size]);

  const addElementInHead = async (value: string) => {
    setButtonsStates({
      addInHead: IButtonsStates.Loading,
      addInTail: IButtonsStates.Disabled,
      deleteFromHead: IButtonsStates.Disabled,
      deleteFromTail: IButtonsStates.Disabled,
      addByIndex: IButtonsStates.Disabled,
      deleteByIndex: IButtonsStates.Disabled,
      valueInput: IButtonsStates.Disabled,
      indexInput: IButtonsStates.Disabled,
    });

    const tempArray = [...listArray];
    if (tempArray[0]) {
      tempArray[0] = {
        ...tempArray[0],
        above: { value, status: ElementStates.Changing },
      };
      setListArray([...tempArray]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    linkedList.prepend(value);
    setHead(linkedList.head);
    createVisibleArray(linkedList.head, {
      index: 0,
      status: ElementStates.Modified,
    });
  };
  const deleteElementFromHead = async (states: boolean = true) => {
    if (states) {
      setButtonsStates({
        addInHead: IButtonsStates.Disabled,
        addInTail: IButtonsStates.Disabled,
        deleteFromHead: IButtonsStates.Loading,
        deleteFromTail: IButtonsStates.Disabled,
        addByIndex: IButtonsStates.Disabled,
        deleteByIndex: IButtonsStates.Disabled,
        valueInput: IButtonsStates.Disabled,
        indexInput: IButtonsStates.Disabled,
      });
    }

    const tempArray = [...listArray];

    if (!head) {
      return;
    }

    const { value } = head;
    tempArray[0] = {
      ...tempArray[0],
      node: { ...tempArray[0].node, value: "" },
      under: { value, status: ElementStates.Changing },
    };
    setListArray([...tempArray]);

    linkedList.removeFromHead();
    setHead(linkedList.head);
  };

  const addElementInTail = async (value: string) => {
    setButtonsStates({
      addInHead: IButtonsStates.Disabled,
      addInTail: IButtonsStates.Loading,
      deleteFromHead: IButtonsStates.Disabled,
      deleteFromTail: IButtonsStates.Disabled,
      addByIndex: IButtonsStates.Disabled,
      deleteByIndex: IButtonsStates.Disabled,
      valueInput: IButtonsStates.Disabled,
      indexInput: IButtonsStates.Disabled,
    });

    const tempArray = [...listArray];

    if (tempArray[tempArray.length - 1]) {
      tempArray[tempArray.length - 1] = {
        ...tempArray[tempArray.length - 1],
        above: { value, status: ElementStates.Changing },
      };
      setListArray([...tempArray]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    linkedList.append(value);

    createVisibleArray(linkedList.head, {
      index: linkedList.size - 1,
      status: ElementStates.Modified,
    });
  };
  const deleteElementFromTail = async () => {
    setButtonsStates({
      addInHead: IButtonsStates.Disabled,
      addInTail: IButtonsStates.Disabled,
      deleteFromHead: IButtonsStates.Disabled,
      deleteFromTail: IButtonsStates.Loading,
      addByIndex: IButtonsStates.Disabled,
      deleteByIndex: IButtonsStates.Disabled,
      valueInput: IButtonsStates.Disabled,
      indexInput: IButtonsStates.Disabled,
    });

    const tempArray = [...listArray];

    if (!head) {
      return;
    }

    tempArray[tempArray.length - 1] = {
      ...tempArray[tempArray.length - 1],
      node: { ...tempArray[tempArray.length - 1].node, value: "" },
      under: {
        value: tempArray[tempArray.length - 1].node.value,
        status: ElementStates.Changing,
      },
    };
    setListArray([...tempArray]);
    await new Promise(resolve => setTimeout(resolve, 500));

    linkedList.removeFromTail();

    createVisibleArray(linkedList.head);
    setHead(linkedList.head);
  };

  const addElementByIndex = async (index: number, value: string) => {
    setButtonsStates({
      addInHead: IButtonsStates.Disabled,
      addInTail: IButtonsStates.Disabled,
      deleteFromHead: IButtonsStates.Disabled,
      deleteFromTail: IButtonsStates.Disabled,
      addByIndex: IButtonsStates.Loading,
      deleteByIndex: IButtonsStates.Disabled,
      valueInput: IButtonsStates.Disabled,
      indexInput: IButtonsStates.Disabled,
    });

    const tempArray = [...listArray];
    let tempNode = linkedList.head;
    let currentIndex = 0;

    while (tempNode!.next) {
      if (index === 0) {
        break;
      }
      tempArray[currentIndex - 1] = {
        ...tempArray[currentIndex - 1],
        above: { value: "", status: ElementStates.Default },
        status: ElementStates.Changing,
      };
      tempArray[currentIndex] = {
        ...tempArray[currentIndex],
        above: { value, status: ElementStates.Changing },
      };
      setListArray([...tempArray]);
      await new Promise(resolve => setTimeout(resolve, 500));

      currentIndex++;

      if (currentIndex === index) {
        break;
      } else {
        tempNode = tempNode!.next;
      }
    }
    tempArray[currentIndex - 1] = {
      ...tempArray[currentIndex - 1],
      above: { value: "", status: ElementStates.Default },
      status: ElementStates.Changing,
    };
    tempArray[currentIndex] = {
      ...tempArray[currentIndex],
      above: { value, status: ElementStates.Changing },
    };
    setListArray([...tempArray]);
    await new Promise(resolve => setTimeout(resolve, 500));
    linkedList.insertAt(value, index);

    tempArray.splice(currentIndex, 0, {
      above: { value: "", status: ElementStates.Default },
      under: { value: "", status: ElementStates.Default },
      status: ElementStates.Default,
      node: { value, next: null },
    });

    tempArray[currentIndex] = {
      ...tempArray[currentIndex],
      status: ElementStates.Modified,
      above: { value: "", status: ElementStates.Default },
    };
    tempArray[currentIndex + 1] = {
      ...tempArray[currentIndex + 1],
      status: ElementStates.Default,
      above: { value: "", status: ElementStates.Default },
    };
    setListArray([...tempArray]);
  };
  const deleteElementByIndex = async (index: number) => {
    setButtonsStates({
      addInHead: IButtonsStates.Disabled,
      addInTail: IButtonsStates.Disabled,
      deleteFromHead: IButtonsStates.Disabled,
      deleteFromTail: IButtonsStates.Disabled,
      addByIndex: IButtonsStates.Disabled,
      deleteByIndex: IButtonsStates.Loading,
      valueInput: IButtonsStates.Disabled,
      indexInput: IButtonsStates.Disabled,
    });

    const tempArray = [...listArray];
    let currentIndex = 0;
    let tempNode = linkedList.head;

    if (!tempNode) {
      return;
    }

    while (tempNode.next) {
      if (index === 0) {
        break;
      }
      tempArray[currentIndex] = {
        ...tempArray[currentIndex],
        status: ElementStates.Changing,
      };
      setListArray([...tempArray]);
      await new Promise(resolve => setTimeout(resolve, 500));

      currentIndex++;

      if (index === currentIndex) {
        break;
      } else {
        tempNode = tempNode.next;
      }
    }
    tempArray[currentIndex] = {
      ...tempArray[currentIndex],
      under: {
        status: ElementStates.Changing,
        value: tempArray[currentIndex].node.value,
      },
      node: {
        ...tempArray[currentIndex].node,
        value: "",
      },
    };
    setListArray([...tempArray]);
    await new Promise(resolve => setTimeout(resolve, 500));
    linkedList.removeAt(currentIndex);
    createVisibleArray(linkedList.head);
  };

  const createVisibleArray = async (
    headNode?: Node<string> | null,
    options?: { index: number; status: ElementStates },
  ) => {
    let currentIndex = 0;
    if (headNode === null) {
      setListArray([]);
      return;
    }
    let tempHead = headNode ? headNode : head;
    let tempNodesArray: {
      above: { value: string; status: ElementStates };
      under: { value: string; status: ElementStates };
      status: ElementStates;
      node: Node<string>;
    }[] = [];

    if (options) {
      while (tempHead) {
        if (currentIndex === options?.index) {
          tempNodesArray = [
            ...tempNodesArray,
            {
              above: { value: "", status: ElementStates.Default },
              under: { value: "", status: ElementStates.Default },
              status: options.status,
              node: tempHead,
            },
          ];
        } else {
          tempNodesArray = [
            ...tempNodesArray,
            {
              above: { value: "", status: ElementStates.Default },
              under: { value: "", status: ElementStates.Default },
              status: ElementStates.Default,
              node: tempHead,
            },
          ];
        }

        tempHead = tempHead.next;
        currentIndex++;
      }
      setListArray([...tempNodesArray]);
      await new Promise(resolve => setTimeout(resolve, 500));
      createVisibleArray(headNode);
    } else {
      while (tempHead) {
        tempNodesArray = [
          ...tempNodesArray,
          {
            above: { value: "", status: ElementStates.Default },
            under: { value: "", status: ElementStates.Default },
            status: ElementStates.Default,
            node: tempHead,
          },
        ];

        tempHead = tempHead.next;
        currentIndex++;
      }
      setListArray([...tempNodesArray]);
    }
  };

  return {
    head,
    listArray,
    addElementInHead,
    deleteElementFromHead,
    addElementInTail,
    deleteElementFromTail,
    addElementByIndex,
    deleteElementByIndex,
    buttonsStates,
  };
};
