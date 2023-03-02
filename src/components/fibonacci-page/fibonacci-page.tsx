import React, { useState, ChangeEvent, FormEvent } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { StyledFormFlex } from "../ui/styled-ui/styled-form-flex";
import { StyledContentFlex } from "../ui/styled-ui/styled-content-flex";

export const FibonacciPage: React.FC = () => {
  const [stringValue, setStringValue] = useState<number>();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fibonacciNumbers, setFibonacciNumbers] = useState<number[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resultArray: number[] = [];
    setButtonLoading(true);
    setFibonacciNumbers([...resultArray]);

    let firstValue = 1;
    let secondValue = 1;
    let nextValue: number;

    setTimeout(async () => {
      resultArray.push(firstValue);
      setFibonacciNumbers([...resultArray]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      resultArray.push(secondValue);
      setFibonacciNumbers([...resultArray]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if ((stringValue as number) > 1) {
        for (let i = 2; i <= (stringValue as number); i++) {
          nextValue = firstValue + secondValue;
          firstValue = secondValue;
          secondValue = nextValue;
          resultArray.push(nextValue);
          setFibonacciNumbers([...resultArray]);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      setButtonLoading(false);
      setStringValue(0);
    }, 1000);
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <StyledFormFlex onSubmit={handleSubmit}>
        <Input
          value={String(stringValue)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setStringValue(Number(e.target.value));
          }}
          max={19}
          isLimitText={true}
          type="number"
          disabled={buttonLoading}
        />
        <Button
          text="Развернуть"
          isLoader={buttonLoading}
          type="submit"
          disabled={stringValue === undefined}
        />
      </StyledFormFlex>
      <StyledContentFlex>
        {fibonacciNumbers.map((item, index) => (
          <Circle key={index} letter={String(item)} tail={String(index)} />
        ))}
      </StyledContentFlex>
    </SolutionLayout>
  );
};
