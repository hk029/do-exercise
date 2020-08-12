import React, { useState, useEffect } from 'react';
import { List, Radio, WhiteSpace, Button } from 'antd-mobile';
import { connect } from 'dva';
import styled, { css } from 'styled-components';
// const RadioItem = Radio.RadioItem;

const Wrap = styled.div`
    padding: 15px 0;
`;

const Ques = styled.div`
    font-size: 16px;
    color: #222;
    min-height: 80px;
    ${({warning}) => (warning ? css`
        color: #e32809;
        font-weight: bold;
    `: '')}
`;

const Options = styled(List)`
    font-size: 16px;
`;

const Map = [
    'A', 'B', 'C', 'D'
];

const RadioItem = styled(Radio.RadioItem)`
    ${({ checked, show }) => checked && show ? css`
        background-color: #f99d8e;
    `: ''}
    ${({ isAnswer, show }) => isAnswer && show ? css`
        background-color: #58ed5d;
    `: ''}
`;

const Text = styled.p`
    overflow: hidden;

    &.right {
        float: right;
    }
`;

const Link = styled.a`
    color: blue;
`;

function Questions(props) {
    const { common, dispatch } = props;
    const [value, setValue] = useState('');
    const [showAnswer, setShow] = useState(false);
    const [warning, setWarning] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const { questions, index, errorList, correctList } = common;

    const ques = questions[index] || { options: [], title: '' };
    const answer = ques.correctAnswer || ques.answer;

    useEffect(() => {
        let warn = false;
        if(correctList.includes(index) || errorList.includes(index)) {
            setDisabled(true);
            setShow(true);
            setValue(answer);
            if(errorList.includes(index)) {
                warn = true;
            }
        } else {
            setShow(false);
            setValue('');
            setDisabled(false);
        }
        setWarning(warn);
    }, [index, answer, correctList, errorList]);

    let options = ques.options.map((option, idx) => ({
        value: Map[idx],
        label: option
    }));

    if (options.length < 4) {
        options = [{
            value: '正确',
            label: '正确',
        }, {
            value: '错误',
            label: '错误',
        }]
    }

    const handleBtn = val => {
        if (val < 0) {
            return dispatch({ type: 'common/preIndex' });
        }
        return dispatch({ type: 'common/nextIndex' });
    }

    const handleAnswer = (val) => {
        setShow(true);
        setValue(val);
        if (val !== answer) {
            dispatch({ type: 'common/setError', payload: index });
        } else {
            dispatch({ type: 'common/setCorrect', payload: index });
        }
    }

    let rate = (correctList.length * 100) / ((correctList.length + errorList.length) || 1);
    rate = rate.toFixed(2) + '%';

    const maybeAnswer = ques.correctAnswer && showAnswer ? <Text>该题答案原答案是: {ques.answer}</Text> : null;
    const link = ques.link && showAnswer ? <Text>参考链接: <Link href={ques.link} target="_blank">{ques.link}</Link></Text> : null;

    return (
        <Wrap>
            <Ques warning={warning}>{`${index + 1}. ${ques.title}`}</Ques>
            <WhiteSpace size="lg"></WhiteSpace>
            <Options>
                {options.map(i => (
                    <RadioItem
                        disabled={disabled}
                        key={i.value}
                        show={showAnswer}
                        checked={value === i.value}
                        isAnswer={answer === i.value}
                        onChange={() => handleAnswer(i.value)}>
                        {i.label}
                    </RadioItem>
                ))}
            </Options>
            <WhiteSpace size="lg"></WhiteSpace>
            <Button onClick={() => handleBtn(-1)}>上一题</Button>
            <WhiteSpace size="sm"></WhiteSpace>
            <Button onClick={() => handleBtn(1)}>下一题</Button>
            <WhiteSpace size="lg"></WhiteSpace>
            <Text className='right'>正确率: {rate}</Text>
            {maybeAnswer}
            {link}
        </Wrap >
    );
}


export default connect(({ common }) => ({
    common
}))(Questions)
