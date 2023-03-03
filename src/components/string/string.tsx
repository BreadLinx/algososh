import React, { ChangeEvent, FormEvent, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { StyledFormFlex } from "../ui/styled-ui/styled-form-flex";
import { StyledContentFlex } from "../ui/styled-ui/styled-content-flex";

const swap = (
  arr: { text: string; status: ElementStates }[],
  firstIndex: number,
  secondIndex: number,
): void => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
};

export const StringComponent: React.FC = () => {
  const [stringValue, setStringValue] = useState<string>("");
  const [stringArray, setStringArray] = useState<
    {
      text: string;
      status: ElementStates;
    }[]
  >([]);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);
    const reversedArray = stringValue
      .split("")
      .map((string): { text: string; status: ElementStates } => {
        return {
          text: string,
          status: ElementStates.Default,
        };
      });
    const maxIndex = Math.floor(reversedArray.length / 2);
    setStringArray(reversedArray);

    setTimeout(async () => {
      for (let i = 0; i < maxIndex; i++) {
        const lastIndex = reversedArray.length - 1 - i;
        reversedArray[i] = {
          ...reversedArray[i],
          status: ElementStates.Changing,
        };
        reversedArray[lastIndex] = {
          ...reversedArray[lastIndex],
          status: ElementStates.Changing,
        };
        setStringArray([...reversedArray]);
        await new Promise(resolve => setTimeout(resolve, 1000));
        swap(reversedArray, i, lastIndex);
        reversedArray[i] = {
          ...reversedArray[i],
          status: ElementStates.Modified,
        };
        reversedArray[lastIndex] = {
          ...reversedArray[lastIndex],
          status: ElementStates.Modified,
        };
        setStringArray([...reversedArray]);
      }

      if ((reversedArray.length / 2) % 1 !== 0) {
        reversedArray[maxIndex] = {
          ...reversedArray[maxIndex],
          status: ElementStates.Changing,
        };
        setStringArray([...reversedArray]);
        await new Promise(resolve => setTimeout(resolve, 1000));
        reversedArray[maxIndex] = {
          ...reversedArray[maxIndex],
          status: ElementStates.Modified,
        };
        setStringArray([...reversedArray]);
      }
      setButtonLoading(false);
      setStringValue("");
    }, 1000);
  };

  return (
    <SolutionLayout title="Строка">
      <StyledFormFlex onSubmit={handleSubmit}>
        <Input
          value={stringValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setStringValue(e.target.value);
          }}
          maxLength={11}
          isLimitText={true}
          disabled={buttonLoading}
        />
        <Button
          text="Развернуть"
          isLoader={buttonLoading}
          disabled={stringValue === ""}
          type="submit"
        />
      </StyledFormFlex>
      <StyledContentFlex>
        {stringArray.map((item, index) => (
          <Circle key={index} letter={item.text} state={item.status} />
        ))}
      </StyledContentFlex>
    </SolutionLayout>
  );
};
