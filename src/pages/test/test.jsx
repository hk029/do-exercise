import React, { useState, useEffect, useRef } from 'react';
import { Progress, List, Radio, WhiteSpace, Modal, Button } from 'antd-mobile';
import { connect } from 'dva';
import styled, { css } from 'styled-components';
import { Link } from 'umi';
// const RadioItem = Radio.RadioItem;

const alert = Modal.alert;

const Wrap = styled.div`
    padding: 15px 0;
    height: 100%;
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
    ${({ checked }) => checked ? css`
        background-color: #e7fcfd;
    `: ''}
`;

const Text = styled.p`
    overflow: hidden;

    &.right {
        float: right;
    }
`;

const Href = styled.a`
    color: blue;
`;

const Empty = styled.div`
    padding: 50px;
    font-size: 14px;
    text-align: center;
`;

const ShowButton = styled(Button)`
    ${({ hide }) => hide ? css`display: none;` : ''};
`;

const Reload = styled(Button)`
    position: fixed !important;
    height: 50px;
    bottom: 100px;
    left: 12px;
    width: calc(100% - 24px);
`;

const Rate = styled.p`
    font-size: 36px;
    font-weight: bold;
    color: ${({rate})=> {
        if(rate * 100 > 60) {
            return '#71ed87';
        }
        return 'red';
    }};
`;

const Info = styled.p`
    margin-top: 80px;
    font-size: 20px;
    font-weight: bold;
`;

const texts = {
    0: 'Emmmm. 我相信这不是你真实的实力吧？',
    40: '不要放弃，再刷一遍题，相信你能再创佳绩！',
    60: '保持良好心态, 考试时候一定能超常发挥！',
    80: '已经很棒了, 请继续保持把！',
    90: '这就是绝对王者的实力吧!',
}


const Result = ({ errors, answers, total, dispatch }) => {
    const rate = (answers - errors) / total;
    const handleReset = () => {
        dispatch({ type: 'common/getTest', payload: true });
    }
    let text = '';
    Object.keys(texts).forEach(v => {
        if (rate * 100 > v) {
            text = texts[v]
        }
    });

    return <Empty>
        本次答题的正确率
        <Rate rate={rate}>{(rate * 100).toFixed(2)}%</Rate>
        其中，一共错了 {errors} 道，未做 {total - answers} 道，所有的错题都已经加入<Link to="/errorbook">错题本</Link>
        <Info>
            {text}
        </Info>
        <Reload onClick={handleReset}>重新开始挑战</Reload>
    </Empty>
}


function Questions(props) {
    const { common, dispatch } = props;
    const { questions, testList } = common;
    const { list, index, answers, result, errorList } = testList;
    // 错题本从0开始
    const [value, setValue] = useState('');

    const reset = () => {
        setValue('');
    }

    // 重新加载试题
    useEffect(() => {
        if (!list.length) {
            dispatch({ type: 'common/getTest' });
            reset();
        }
    }, [list, dispatch])

    useEffect(() => {
        setValue(answers[index]);
    }, [index, answers]);

    if (!list.length) {
        return <Empty>正在生成模拟试题目，请稍后...</Empty>;
    }

    if (result) {
        return <Result dispatch={dispatch} answers={answers.length} errors={errorList.length} total={list.length}></Result>
    }


    const trueIndex = list[index];
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
            return dispatch({ type: 'common/preTestIndex' });
        }
        return dispatch({ type: 'common/nextTestIndex' });
    }

    const handleAnswer = (val) => {
        setValue(val);
        dispatch({ type: 'common/setTestAnswer', payload: { id: trueIndex, idx: index, answer: val, wrong: val !== answer } });
    }

    const handleSubmit = () => {
        dispatch({ type: 'common/setTestResult', payload: true });
    }

    const progress = (index + 1) * 100 / (list.length);
    const progressText = progress.toFixed(2) + '%';

    return (
        <Wrap>
            <Ques>{`${index + 1}. ${ques.title}`}</Ques>
            <WhiteSpace size="lg"></WhiteSpace>
            <Options>
                {options.map(i => (
                    <RadioItem
                        key={i.value}
                        show={true}
                        checked={value === i.value}
                        onChange={() => handleAnswer(i.value)}>
                        {i.label}
                    </RadioItem>
                ))}
            </Options>
            <WhiteSpace size="lg"></WhiteSpace>
            <ShowButton onClick={() => handleBtn(-1)} disabled={index <= 0} >上一题</ShowButton>
            <ShowButton onClick={() => handleBtn(1)} disabled={index >= list.length - 1} >下一题</ShowButton>
            <WhiteSpace size="lg"></WhiteSpace>
            <Progress percent={progress} position="normal"></Progress>
            <Text className='left'>答题进度: {progressText}</Text>
            <Reload
                onClick={() =>
                    alert('提交', '提交了将无法修改，确定提交吗？', [
                        { text: '取消', onPress: () => console.log('cancel') },
                        { text: '确定', onPress: handleSubmit },
                    ])
                }
            >
                提交答案
    </Reload>
        </Wrap >
    );
}


export default connect(({ common }) => ({
    common
}))(Questions)
