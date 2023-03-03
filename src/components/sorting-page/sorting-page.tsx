import React, { ChangeEvent, useState, FormEvent, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Button } from "../ui/button/button";
import { RadioInput } from "../ui/radio-input/radio-input";
import styled from "styled-components";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";
import { ElementStates } from "../../types/element-states";
import { StyledContentFlex } from "../ui/styled-ui/styled-content-flex";
import { StyledFormFlex } from "../ui/styled-ui/styled-form-flex";

const StyledRadioWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 60px;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-right: 40px;
`;

type RadioValue = "bubble" | "select";

const swap = (
  arr: {
    value: number;
    status: ElementStates;
  }[],
  firstIndex: number,
  secondIndex: number,
): void => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
};

export const SortingPage: React.FC = () => {
  const [buttonLoading, setButtonLoading] = useState({
    ascendingButton: false,
    descendingButton: false,
  });

  const [sortingType, setSortingType] = useState<RadioValue>("select");
  const [sortingArray, setSortingArray] = useState<
    {
      value: number;
      status: ElementStates;
    }[]
  >([]);

  const randomArr = () => {
    const resultArray: {
      value: number;
      status: ElementStates;
    }[] = [];
    function getRandomInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    for (let i = 0; i < getRandomInt(3, 17); i++) {
      resultArray.push({
        value: getRandomInt(0, 100),
        status: ElementStates.Default,
      });
    }
    setSortingArray([...resultArray]);
  };

  useEffect(() => {
    randomArr();
  }, []);

  const sortArrayAscending = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading({
      ...buttonLoading,
      ascendingButton: true,
    });
    let tempArray = [...sortingArray];
    tempArray = tempArray.map(item => ({
      ...item,
      status: ElementStates.Default,
    }));

    for (let i = 0; i < tempArray.length - 1; i++) {
      let minIndex = i;

      tempArray[minIndex] = {
        ...tempArray[minIndex],
        status: ElementStates.Changing,
      };
      setSortingArray([...tempArray]);
      await new Promise(resolve => setTimeout(resolve, 500));

      for (let d = i + 1; d < tempArray.length; d++) {
        tempArray[d] = {
          ...tempArray[d],
          status: ElementStates.Changing,
        };
        setSortingArray([...tempArray]);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (tempArray[d].value < tempArray[minIndex].value) {
          tempArray[minIndex] = {
            ...tempArray[minIndex],
            status: ElementStates.Default,
          };
          setSortingArray([...tempArray]);
          minIndex = d;
        } else {
          tempArray[d] = {
            ...tempArray[d],
            status: ElementStates.Default,
          };
          setSortingArray([...tempArray]);
        }
      }
      tempArray[minIndex] = {
        ...tempArray[minIndex],
        status: ElementStates.Modified,
      };
      setSortingArray([...tempArray]);
      swap(tempArray, i, minIndex);
      if (i === tempArray.length - 2) {
        tempArray[i + 1] = {
          ...tempArray[i + 1],
          status: ElementStates.Modified,
        };
        setSortingArray([...tempArray]);
      }
    }

    setSortingArray([...tempArray]);
    setButtonLoading({
      ...buttonLoading,
      ascendingButton: false,
    });
  };

  const sortArrayDescending = async () => {
    setButtonLoading({
      ...buttonLoading,
      descendingButton: true,
    });
    let tempArray = [...sortingArray];
    tempArray = tempArray.map(item => ({
      ...item,
      status: ElementStates.Default,
    }));

    for (let i = 0; i < tempArray.length; i++) {
      let maxIndex = i;
      tempArray[maxIndex] = {
        ...tempArray[maxIndex],
        status: ElementStates.Changing,
      };
      setSortingArray([...tempArray]);
      await new Promise(resolve => setTimeout(resolve, 500));

      for (let d = i + 1; d < tempArray.length; d++) {
        tempArray[d] = {
          ...tempArray[d],
          status: ElementStates.Changing,
        };
        setSortingArray([...tempArray]);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (tempArray[d].value > tempArray[maxIndex].value) {
          tempArray[maxIndex] = {
            ...tempArray[maxIndex],
            status: ElementStates.Default,
          };
          setSortingArray([...tempArray]);
          maxIndex = d;
        } else {
          tempArray[d] = {
            ...tempArray[d],
            status: ElementStates.Default,
          };
          setSortingArray([...tempArray]);
        }
      }
      swap(tempArray, i, maxIndex);
      tempArray[i] = {
        ...tempArray[i],
        status: ElementStates.Modified,
      };
      setSortingArray([...tempArray]);
    }

    setSortingArray([...tempArray]);
    setButtonLoading({
      ...buttonLoading,
      descendingButton: false,
    });
  };

  const bubbleSortAscending = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading({
      ...buttonLoading,
      ascendingButton: true,
    });
    let tempArray = [...sortingArray];
    tempArray = tempArray.map(item => ({
      ...item,
      status: ElementStates.Default,
    }));

    for (let i = 0; i < tempArray.length; i++) {
      for (let j = 0; j < tempArray.length - i - 1; j++) {
        tempArray[j] = {
          ...tempArray[j],
          status: ElementStates.Changing,
        };
        tempArray[j + 1] = {
          ...tempArray[j + 1],
          status: ElementStates.Changing,
        };
        setSortingArray([...tempArray]);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (tempArray[j].value > tempArray[j + 1].value) {
          swap(tempArray, j, j + 1);
        }
        tempArray[j] = {
          ...tempArray[j],
          status: ElementStates.Default,
        };
        tempArray[j + 1] = {
          ...tempArray[j + 1],
          status: ElementStates.Default,
        };
      }

      tempArray[tempArray.length - 1 - i] = {
        ...tempArray[tempArray.length - 1 - i],
        status: ElementStates.Modified,
      };
      setSortingArray([...tempArray]);
    }
    setSortingArray([...tempArray]);
    setButtonLoading({
      ...buttonLoading,
      ascendingButton: false,
    });
  };

  const bubbleSortDescending = async () => {
    setButtonLoading({
      ...buttonLoading,
      descendingButton: true,
    });
    let tempArray = [...sortingArray];

    tempArray = tempArray.map(item => ({
      ...item,
      status: ElementStates.Default,
    }));

    for (let i = 0; i < tempArray.length; i++) {
      for (let j = 0; j < tempArray.length - i - 1; j++) {
        tempArray[j] = {
          ...tempArray[j],
          status: ElementStates.Changing,
        };
        tempArray[j + 1] = {
          ...tempArray[j + 1],
          status: ElementStates.Changing,
        };
        setSortingArray([...tempArray]);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (tempArray[j].value < tempArray[j + 1].value) {
          swap(tempArray, j, j + 1);
        }
        tempArray[j] = {
          ...tempArray[j],
          status: ElementStates.Default,
        };
        tempArray[j + 1] = {
          ...tempArray[j + 1],
          status: ElementStates.Default,
        };
      }
      tempArray[tempArray.length - 1 - i] = {
        ...tempArray[tempArray.length - 1 - i],
        status: ElementStates.Modified,
      };
      setSortingArray([...tempArray]);
    }
    setSortingArray([...tempArray]);
    setButtonLoading({
      ...buttonLoading,
      descendingButton: false,
    });
  };

  return (
    <SolutionLayout title="Сортировка массива">
      <StyledFormFlex
        onSubmit={
          sortingType === "select" ? sortArrayAscending : bubbleSortAscending
        }
      >
        <StyledRadioWrapper>
          <RadioInput
            name="sortingType"
            label="Выбор"
            value="select"
            checked={sortingType === "select"}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSortingType(e.target.value as RadioValue);
            }}
          />
          <RadioInput
            name="sortingType"
            label="Пузырек"
            value="bubble"
            checked={sortingType === "bubble"}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSortingType(e.target.value as RadioValue);
            }}
          />
        </StyledRadioWrapper>

        <Button
          sorting={Direction.Ascending}
          text="По возрастанию"
          isLoader={buttonLoading.ascendingButton}
          disabled={buttonLoading.descendingButton}
          type="submit"
        />
        <Button
          sorting={Direction.Descending}
          text="По убыванию"
          isLoader={buttonLoading.descendingButton}
          disabled={buttonLoading.ascendingButton}
          type="button"
          onClick={
            sortingType === "select"
              ? sortArrayDescending
              : bubbleSortDescending
          }
          style={{ marginRight: 68 }}
        />
        <Button
          onClick={randomArr}
          text="Новый массив"
          disabled={
            buttonLoading.ascendingButton || buttonLoading.descendingButton
          }
          type="button"
        />
      </StyledFormFlex>
      <StyledContentFlex style={{ maxWidth: 7000 }}>
        {sortingArray.map((item, index) => (
          <Column key={index} index={item.value} state={item.status} />
        ))}
      </StyledContentFlex>
    </SolutionLayout>
  );
};
