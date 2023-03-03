import React, { useState, ChangeEvent, useEffect, Fragment } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { StyledFormFlex } from "../ui/styled-ui/styled-form-flex";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import styled from "styled-components";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { useLinkedList } from "../../hooks/useLinkedLIst";
import { IButtonsStates } from "../../types/buttons-states";

const CustomFormFlex = styled(StyledFormFlex)`
  flex-flow: column nowrap;
  max-width: 952px;
`;

const FormBlockFlex = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 12px;
`;

const StyledLinkedList = styled.ul`
  padding: 0;
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  column-gap: 15px;
  row-gap: 50px;
  align-items: center;
  justify-content: center;
  margin-top: 115px;
  padding-bottom: 50px;
`;

const StyledLinkedListElement = styled.li`
  position: relative;
`;

const StyledLinkedListTail = styled.p`
  font-size: 18px;
  position: absolute;
  top: 95px;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledSmallBottomCircleWrapper = styled.div`
  position: absolute;
  top: 145px;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledSmallTopCircleWrapper = styled.div`
  position: absolute;
  bottom: 115px;
  left: 50%;
  transform: translateX(-50%);
`;

export const ListPage: React.FC = () => {
  const [stringValue, setStringValue] = useState<string>("");
  const [indexValue, setIndexValue] = useState<number>();

  const {
    listArray,
    addElementInHead,
    deleteElementFromHead,
    addElementInTail,
    deleteElementFromTail,
    addElementByIndex,
    deleteElementByIndex,
    buttonsStates,
  } = useLinkedList(5);

  return (
    <SolutionLayout title="Связный список">
      <CustomFormFlex autoComplete="off" noValidate>
        <FormBlockFlex>
          <Input
            value={stringValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setStringValue(e.target.value);
            }}
            maxLength={4}
            minLength={1}
            isLimitText={true}
            placeholder="Введите значение"
            name="valueInput"
            disabled={buttonsStates.valueInput === IButtonsStates.Disabled}
          />
          <Button
            style={{ minWidth: 175 }}
            text="Добавить в head"
            isLoader={buttonsStates.addInHead === IButtonsStates.Loading}
            disabled={
              buttonsStates.addInHead === IButtonsStates.Disabled ||
              stringValue === ""
            }
            type="button"
            onClick={() => {
              addElementInHead(stringValue);
              setStringValue("");
            }}
          />
          <Button
            style={{ minWidth: 175 }}
            text="Добавить в tail"
            isLoader={buttonsStates.addInTail === IButtonsStates.Loading}
            disabled={
              buttonsStates.addInTail === IButtonsStates.Disabled ||
              stringValue === ""
            }
            type="button"
            onClick={() => {
              addElementInTail(stringValue);
              setStringValue("");
            }}
          />
          <Button
            style={{ minWidth: 175 }}
            text="Удалить из head"
            isLoader={buttonsStates.deleteFromHead === IButtonsStates.Loading}
            disabled={buttonsStates.deleteFromHead === IButtonsStates.Disabled}
            type="button"
            onClick={deleteElementFromHead}
          />
          <Button
            style={{ minWidth: 175 }}
            text="Удалить из tail"
            isLoader={buttonsStates.deleteFromTail === IButtonsStates.Loading}
            disabled={buttonsStates.deleteFromTail === IButtonsStates.Disabled}
            type="button"
            onClick={deleteElementFromTail}
          />
        </FormBlockFlex>
        <FormBlockFlex>
          <Input
            value={indexValue !== undefined ? String(indexValue) : ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (Number(e.target.value) > listArray.length - 1) {
                if (listArray.length === 0) {
                  setIndexValue(undefined);
                  return;
                }
                setIndexValue(listArray.length - 1);
                return;
              }
              if (Number(e.target.value) < 0) {
                setIndexValue(0);
                return;
              }
              setIndexValue(Number(e.target.value));
            }}
            placeholder="Введите индекс"
            type="number"
            name="indexInput"
            disabled={buttonsStates.indexInput === IButtonsStates.Disabled}
          />
          <Button
            text="Добавить по индексу"
            type="button"
            isLoader={buttonsStates.addByIndex === IButtonsStates.Loading}
            disabled={
              buttonsStates.addByIndex === IButtonsStates.Disabled ||
              stringValue === "" ||
              indexValue === undefined
            }
            onClick={() => {
              addElementByIndex(indexValue as number, stringValue);
              setStringValue("");
              setIndexValue(undefined);
            }}
            style={{ minWidth: 362 }}
          />
          <Button
            onClick={() => {
              deleteElementByIndex(indexValue as number);
              setIndexValue(undefined);
            }}
            text="Удалить по индексу"
            isLoader={buttonsStates.deleteByIndex === IButtonsStates.Loading}
            disabled={
              buttonsStates.deleteByIndex === IButtonsStates.Disabled ||
              indexValue === undefined
            }
            type="button"
            style={{ minWidth: 362 }}
          />
        </FormBlockFlex>
      </CustomFormFlex>
      <StyledLinkedList>
        {listArray &&
          listArray.map((item, index) => {
            return (
              <Fragment key={index}>
                <StyledLinkedListElement>
                  {item.above.value && (
                    <StyledSmallTopCircleWrapper>
                      <Circle
                        isSmall
                        letter={item.above.value}
                        state={item.above.status}
                      />
                    </StyledSmallTopCircleWrapper>
                  )}

                  <Circle
                    head={index === 0 ? "head" : ""}
                    letter={String(item.node.value)}
                    tail={String(index)}
                    state={item.status}
                  />

                  {index === listArray.length - 1 && (
                    <StyledLinkedListTail>tail</StyledLinkedListTail>
                  )}

                  {item.under.value && (
                    <StyledSmallBottomCircleWrapper>
                      <Circle
                        isSmall
                        letter={item.under.value}
                        state={item.under.status}
                      />
                    </StyledSmallBottomCircleWrapper>
                  )}
                </StyledLinkedListElement>
                {listArray.length - 1 !== index && <ArrowIcon />}
              </Fragment>
            );
          })}
      </StyledLinkedList>
    </SolutionLayout>
  );
};
