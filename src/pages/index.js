import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import styled, { css } from 'styled-components';

const Wrap = styled.div`
    padding: 15px 0;
`;

const Button = styled(Link)`
    width: 80%;
    margin: 0 auto;
    height: 200px;
    display: block;
    line-height: 200px;
    text-align: center;
    font-size: 40px;
    background: #9deeba;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 8px 6px #e3e1dd;
`

const ErrorButton = styled(Button)`
    background: #fdf377;
    color: #f27e39;
`;

function Questions(props) {

    return (
        <Wrap>
            <Button to='/exercise'>练习</Button>
            <ErrorButton to='/errorbook'>错题本</ErrorButton>
        </Wrap >
    );
}


export default connect(({ common }) => ({
    common
}))(Questions)
