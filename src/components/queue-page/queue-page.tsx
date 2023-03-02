import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  MouseEvent,
} from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import styled from "styled-components";
import { Queue } from "../../constants/queue";
import { StyledFormFlex } from "../ui/styled-ui/styled-form-flex";
import { StyledContentFlex } from "../ui/styled-ui/styled-content-flex";
import { IButtonsStates } from "../../types/buttons-states";

const StyledList = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
`;

const StyledListElement = styled.li`
  display: flex;
  flex-flow: column nowrap;
  gap: 15px;
  align-items: center;
`;

const StyledTailText = styled.p`
  font-size: 18px;
`;

const queue = new Queue<string>(6);

export const QueuePage: React.FC = () => {
  const [stringValue, setStringValue] = useState<string>("");
  const [buttonLoading, setButtonLoading] = useState({
    mainInput: IButtonsStates.Default,
    addButton: IButtonsStates.Default,
    deleteButton: IButtonsStates.Disabled,
    resetButton: IButtonsStates.Disabled,
  });
  const [visibleQueue, setVisibleQueue] = useState<
    {
      value: string;
      status: ElementStates;
    }[]
  >([]);

  const [changeReactEvent, setChangeReactEvent] = useState(0);

  const { length, head, tail } = queue;

  useEffect(() => {
    const tempArray: { value: string; status: ElementStates }[] = [];

    for (let i = 0; i < queue.container.length; i++) {
      tempArray.push({
        value: queue.container[i] || "",
        status: ElementStates.Default,
      });
    }

    setVisibleQueue([...tempArray]);
  }, [length]);

  useEffect(() => {
    return () => queue.resetQueue();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading({
      mainInput: IButtonsStates.Disabled,
      addButton: IButtonsStates.Loading,
      deleteButton: IButtonsStates.Disabled,
      resetButton: IButtonsStates.Disabled,
    });
    const tempArray = [...visibleQueue];
    tempArray[tail] = {
      ...tempArray[tail],
      status: ElementStates.Changing,
    };
    setVisibleQueue([...tempArray]);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      queue.enqueue(stringValue);
      setStringValue("");
    } catch (err) {
      tempArray[tail] = {
        ...tempArray[tail],
        status: ElementStates.Default,
      };
      setVisibleQueue([...tempArray]);
      setButtonLoading({
        mainInput: IButtonsStates.Default,
        addButton: IButtonsStates.Default,
        deleteButton: IButtonsStates.Default,
        resetButton: IButtonsStates.Default,
      });
    }
    setButtonLoading({
      mainInput: IButtonsStates.Default,
      addButton: IButtonsStates.Default,
      deleteButton: IButtonsStates.Default,
      resetButton: IButtonsStates.Default,
    });
  };

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    setButtonLoading({
      mainInput: IButtonsStates.Disabled,
      addButton: IButtonsStates.Disabled,
      deleteButton: IButtonsStates.Loading,
      resetButton: IButtonsStates.Disabled,
    });

    const tempArray = [...visibleQueue];
    tempArray[head] = {
      ...tempArray[head],
      status: ElementStates.Changing,
    };
    setVisibleQueue([...tempArray]);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      queue.dequeue();
    } catch (err) {
      tempArray[head] = {
        ...tempArray[head],
        status: ElementStates.Default,
      };
      setVisibleQueue([...tempArray]);
      if (tempArray.length === 0) {
        setButtonLoading({
          mainInput: IButtonsStates.Default,
          addButton: IButtonsStates.Default,
          deleteButton: IButtonsStates.Disabled,
          resetButton: IButtonsStates.Disabled,
        });
      } else {
        setButtonLoading({
          mainInput: IButtonsStates.Default,
          addButton: IButtonsStates.Default,
          deleteButton: IButtonsStates.Default,
          resetButton: IButtonsStates.Default,
        });
      }
    }

    if (tempArray.length === 0) {
      setButtonLoading({
        mainInput: IButtonsStates.Default,
        addButton: IButtonsStates.Default,
        deleteButton: IButtonsStates.Disabled,
        resetButton: IButtonsStates.Disabled,
      });
    } else {
      setButtonLoading({
        mainInput: IButtonsStates.Default,
        addButton: IButtonsStates.Default,
        deleteButton: IButtonsStates.Default,
        resetButton: IButtonsStates.Default,
      });
    }
  };
  const handleReset = () => {
    queue.resetQueue();
    setChangeReactEvent(changeReactEvent + 1);
  };

  return (
    <SolutionLayout title="Очередь">
      <StyledFormFlex onSubmit={handleSubmit}>
        <Input
          value={stringValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setStringValue(e.target.value);
          }}
          maxLength={4}
          isLimitText={true}
          disabled={buttonLoading.mainInput === IButtonsStates.Disabled}
        />
        <Button
          text="Добавить"
          isLoader={buttonLoading.addButton === IButtonsStates.Loading}
          disabled={
            stringValue === "" ||
            buttonLoading.addButton === IButtonsStates.Disabled
          }
          type="submit"
        />
        <Button
          text="Удалить"
          isLoader={buttonLoading.deleteButton === IButtonsStates.Loading}
          disabled={buttonLoading.deleteButton === IButtonsStates.Disabled}
          type="button"
          onClick={handleDelete}
        />
        <Button
          onClick={handleReset}
          text="Очистить"
          isLoader={buttonLoading.resetButton === IButtonsStates.Loading}
          disabled={buttonLoading.resetButton === IButtonsStates.Disabled}
          type="button"
        />
      </StyledFormFlex>
      <StyledContentFlex>
        <StyledList>
          {visibleQueue.map((item, index) => (
            <StyledListElement key={index + Math.floor(Math.random() * 100000)}>
              <Circle
                letter={item.value}
                head={queue.head === index ? "head" : ""}
                tail={String(index)}
                state={item.status}
              />
              {queue.tail === index && <StyledTailText>tail</StyledTailText>}
            </StyledListElement>
          ))}
        </StyledList>
      </StyledContentFlex>
    </SolutionLayout>
  );
};
