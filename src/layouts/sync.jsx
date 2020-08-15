import { Modal, Button, Toast } from 'antd-mobile';
import { connect } from 'dva';
import styled from 'styled-components';

const prompt = Modal.prompt;

const Btn = styled.span`
    border: none;
    color: #108ee9;
    font-size: 14px;
`;
const Sync = (props) => {
    const { common, dispatch } = props;
    const { user } = common;


    return <Btn onClick={() => prompt('同步数据', '输入同步码（会自动同步本地和线上数据）',
        [
            {
                text: '取消',
                onPress: value => new Promise((resolve) => {
                    resolve();
                }),
            },
            {
                text: '同步',
                onPress: value => new Promise((resolve, reject) => {
                    dispatch({type: 'common/getUser', payload: value}).then(() => {
                        resolve();
                        Toast.info('同步成功', 1);
                    })
                }),
            },
        ], 'default', user, ['>4 位的自定义字符，没有会创建'])}
    >同步数据</Btn>
}


export default connect(({ common }) => ({
    common
}))(Sync)
