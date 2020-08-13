import React, { useState, useEffect, useRef } from 'react';
import { Toast, List, Radio, WhiteSpace, Button } from 'antd-mobile';
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
    ${({ warning }) => (warning ? css`
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

const Empty = styled.div`
    padding: 50px;
    font-size: 18px;
    text-align: center;
`;

const ShowButton = styled(Button)`
    ${({ hide }) => hide ? css`display: none;` : ''};
`;

const Reload = styled(Button)`
    ${({ show }) => !show ? css`display: none;` : ''};
`;


const rainbow = ['哇，你真棒，暂时还没有错题哦！🤩',
    '这位少侠/女侠，我看你骨骼惊奇，天赋异禀，是个练武奇才，我这有本葵花宝典……📖',
    '竟然是零错题！小弟对你的景仰犹如滔滔江水连绵不绝又如黄河泛滥一发不可收拾，请接受小弟一拜！😍',
    '这个智商，我能舔一辈子😘',
    '这是哪里来的机智的小天使啊👼',
    '你可真是万中无一，人中龙凤👍',
    '美貌与智慧并重，说的就你吧🤔',
]

function RandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.floor(Rand * Range);  //舍去
    return num;
}


function Questions(props) {
    const { common, dispatch } = props;
    // 错题本从0开始
    const [index, setIndex] = useState(0);
    // 存一份errorList的数据（因为答题过程中数组会变）
    const init = useRef(false);
    const [reload, setReload] = useState(false);
    const [curErrorList, setErrorList] = useState(0);
    const [value, setValue] = useState('');
    const [showAnswer, setShow] = useState(false);
    const [warning, setWarning] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const { questions, errorList } = common;
    const trueIndex = curErrorList[index] || -1;

    const reset = () => {
        setIndex(0);
        setShow(false);
        setReload(false);
        setValue('');
        setDisabled(false);
        setWarning(false);
    }

    useEffect(() => {
        if (!init.current || reload) {
            setErrorList(errorList);
            reset();
            init.current = true;
        }
    }, [errorList, reload])

    useEffect(() => {
        reset();
    }, [index]);


    if (trueIndex < 0) {
        const rand = RandomNum(0, rainbow.length)
        return <Empty>{rainbow[rand]}</Empty>;
    }

    const ques = questions[trueIndex] || { options: [], title: '' };
    const answer = ques.correctAnswer || ques.answer;

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
            return setIndex(Math.max(0, index - 1));
        }
        return setIndex(Math.min(curErrorList.length - 1, index + 1));
    }

    const handleAnswer = (val) => {
        if (showAnswer) {
            return Toast.info('修改答案可不好哦~');
        }
        setShow(true);
        setValue(val);
        if (val === answer) {
            dispatch({ type: 'common/correctQuestion', payload: trueIndex });
        }

    }

    const maybeAnswer = ques.correctAnswer && showAnswer ? <Text>该题答案原答案是: {ques.answer}</Text> : null;
    const link = ques.link && showAnswer ? <Text>参考链接: <Link href={ques.link} target="_blank">{ques.link}</Link></Text> : null;

    const finalAction = () => {
        // 还没有到展示的时候
        if (!showAnswer || index < curErrorList.length - 1) {
            return null
        }
        if (answer !== value) {
            return <>
                <Empty style={{ color: 'red' }}>真遗憾，还有错题😔,再接再厉吧！</Empty>
                <Reload onClick={() => setReload(true)} show>重新开始挑战</Reload>
            </>
        }
        return <Empty>恭喜您完成所有错题！简直太棒了！👏</Empty>
    }

    return (
        <Wrap>
            <Ques warning={warning}>{`${trueIndex + 1}. ${ques.title}`}</Ques>
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
            <ShowButton onClick={() => handleBtn(1)} hide={index >= curErrorList.length - 1} >下一题</ShowButton>
            <WhiteSpace size="lg"></WhiteSpace>
            {maybeAnswer}
            {link}
            {finalAction()}
        </Wrap >
    );
}


export default connect(({ common }) => ({
    common
}))(Questions)
