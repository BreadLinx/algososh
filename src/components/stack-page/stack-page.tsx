import React, { ChangeEvent, useState, FormEvent, MouseEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { StyledContentFlex } from "../ui/styled-ui/styled-content-flex";
import { StyledFormFlex } from "../ui/styled-ui/styled-form-flex";
import { IButtonsStates } from "../../types/buttons-states";

export const StackPage: React.FC = () => {
  const [stringValue, setStringValue] = useState<string>("");
  const [buttonLoading, setButtonLoading] = useState({
    addButton: IButtonsStates.Default,
    deleteButton: IButtonsStates.Disabled,
    resetButton: IButtonsStates.Disabled,
    mainInput: IButtonsStates.Default,
  });
  const [stack, setStack] = useState<
    {
      text: string;
      status: ElementStates;
    }[]
  >([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading({
      addButton: IButtonsStates.Loading,
      deleteButton: IButtonsStates.Disabled,
      resetButton: IButtonsStates.Disabled,
      mainInput: IButtonsStates.Disabled,
    });

    setStringValue("");
    const intermediateArray = [...stack];
    intermediateArray.push({
      text: stringValue,
      status: ElementStates.Changing,
    });
    setStack([...intermediateArray]);
    await new Promise(resolve => setTimeout(resolve, 500));
    intermediateArray[intermediateArray.length - 1] = {
      ...intermediateArray[intermediateArray.length - 1],
      status: ElementStates.Default,
    };
    setStack([...intermediateArray]);
    setButtonLoading({
      addButton: IButtonsStates.Default,
      deleteButton: IButtonsStates.Default,
      resetButton: IButtonsStates.Default,
      mainInput: IButtonsStates.Default,
    });
  };

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setButtonLoading({
      addButton: IButtonsStates.Disabled,
      deleteButton: IButtonsStates.Loading,
      resetButton: IButtonsStates.Disabled,
      mainInput: IButtonsStates.Disabled,
    });

    const intermediateArray = [...stack];

    intermediateArray[intermediateArray.length - 1] = {
      ...intermediateArray[intermediateArray.length - 1],
      status: ElementStates.Changing,
    };
    setStack([...intermediateArray]);
    await new Promise(resolve => setTimeout(resolve, 500));
    intermediateArray.pop();
    setStack([...intermediateArray]);

    if (intermediateArray.length === 0) {
      setButtonLoading({
        addButton: IButtonsStates.Default,
        deleteButton: IButtonsStates.Disabled,
        resetButton: IButtonsStates.Disabled,
        mainInput: IButtonsStates.Default,
      });
    } else {
      setButtonLoading({
        addButton: IButtonsStates.Default,
        deleteButton: IButtonsStates.Default,
        resetButton: IButtonsStates.Default,
        mainInput: IButtonsStates.Default,
      });
    }
  };

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStack([]);
    setButtonLoading({
      addButton: IButtonsStates.Default,
      deleteButton: IButtonsStates.Disabled,
      resetButton: IButtonsStates.Disabled,
      mainInput: IButtonsStates.Default,
    });
  };

  return (
    <SolutionLayout title="Стек">
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
          type="submit"
          disabled={
            stringValue === "" ||
            buttonLoading.addButton === IButtonsStates.Disabled
          }
        />
        <Button
          text="Удалить"
          isLoader={buttonLoading.deleteButton === IButtonsStates.Loading}
          type="button"
          onClick={handleDelete}
          disabled={buttonLoading.deleteButton === IButtonsStates.Disabled}
        />
        <Button
          onClick={handleReset}
          text="Очистить"
          isLoader={buttonLoading.resetButton === IButtonsStates.Loading}
          type="button"
          disabled={buttonLoading.resetButton === IButtonsStates.Disabled}
        />
      </StyledFormFlex>
      <StyledContentFlex>
        {stack.map((item, index) => (
          <Circle
            key={index}
            letter={item.text}
            state={item.status}
            head={stack.length - 1 === index ? "top" : null}
            tail={String(index)}
          />
        ))}
      </StyledContentFlex>
    </SolutionLayout>
  );
};
