import { useState, useEffect, ChangeEvent } from "react";
import { ElementStates } from "../types/element-states";
import { IButtonsStates } from "../types/buttons-states";

interface INode<T> {
  value: T;
  next: INode<T> | null;
}

class Node<T> implements INode<T> {
  value: T;
  next: Node<T> | null;
  constructor(value: T, next?: Node<T> | null) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
  const [head, setHead] = useState<Node<string> | null>(null);
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
    let tempHead: Node<string> | null = null;

    for (let i = 1; i <= size; i++) {
      const tempNode: Node<string> = new Node<string>(
        String(getRandomInt(1, 100)),
        tempHead,
      );

      tempHead = tempNode;
    }

    setHead(tempHead);
    createVisibleArray(tempHead);
  }, []);

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

    const tempNode = new Node<string>(value, head);
    setHead(tempNode);
    createVisibleArray(tempNode, { index: 0, status: ElementStates.Modified });

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
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!head.next) {
      createVisibleArray(null);
      setHead(null);

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

      return;
    }

    createVisibleArray(head.next);
    setHead(head.next);

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
    const tail = getTail();
    const tempNode = new Node<string>(value);

    if (tempArray[tempArray.length - 1]) {
      tempArray[tempArray.length - 1] = {
        ...tempArray[tempArray.length - 1],
        above: { value, status: ElementStates.Changing },
      };
      setListArray([...tempArray]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (tail.node) {
      tail.node.next = tempNode;
      createVisibleArray(head, {
        index: getTail().index,
        status: ElementStates.Modified,
      });
    } else {
      setHead(tempNode);
      createVisibleArray(tempNode);
    }

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
    const tail = getTail().node;
    const { value } = tail as Node<string>;

    tempArray[tempArray.length - 1] = {
      ...tempArray[tempArray.length - 1],
      node: { ...tempArray[tempArray.length - 1].node, value: "" },
      under: { value, status: ElementStates.Changing },
    };
    setListArray([...tempArray]);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!head.next) {
      createVisibleArray(null);
      setHead(null);

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

      return;
    }

    let tempNode: Node<string> = head;
    let beforeTail: Node<string> | null = null;

    while (tempNode.next) {
      beforeTail = tempNode;
      tempNode = tempNode.next;
    }

    (beforeTail as Node<string>).next = null;
    createVisibleArray();

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
    const insertiveNode = new Node<string>(value);
    let tempNode = head;
    let currentIndex = 0;
    if (currentIndex === index) {
      addElementInHead(value);
      return;
    }

    if (!tempNode) {
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
      return;
    }

    while (tempNode.next) {
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
        const tempInsertionNode = tempNode.next;
        tempNode.next = insertiveNode;
        insertiveNode.next = tempInsertionNode;
        break;
      } else {
        tempNode = tempNode.next;
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

    createVisibleArray(head, {
      index: currentIndex,
      status: ElementStates.Modified,
    });

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
    let tempNode = head;

    if (index === currentIndex) {
      deleteElementFromHead(false);
      return;
    }

    if (!tempNode) {
      return;
    }

    while (tempNode.next) {
      tempArray[currentIndex] = {
        ...tempArray[currentIndex],
        status: ElementStates.Changing,
      };
      setListArray([...tempArray]);
      await new Promise(resolve => setTimeout(resolve, 500));

      currentIndex++;
      if (index === currentIndex) {
        const nextChainNode = tempNode.next.next;
        tempNode.next = nextChainNode;
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
    createVisibleArray();

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
  };

  const getTail = () => {
    let tempNode = head;
    let currentIndex = 0;

    while (tempNode) {
      if (tempNode.next) {
        tempNode = tempNode.next;
        currentIndex++;
      } else {
        break;
      }
    }

    return { index: currentIndex, node: tempNode };
  };

  const createVisibleArray = async (
    headNode?: Node<string> | null,
    options?: { index: number; status: ElementStates },
  ) => {
    let currentIndex = 0;
    let tempHead = headNode ? headNode : head;
    let tempNodesArray: {
      above: { value: string; status: ElementStates };
      under: { value: string; status: ElementStates };
      status: ElementStates;
      node: Node<string>;
    }[] = [];

    if (headNode === null) {
      setListArray([]);
      return;
    }

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
