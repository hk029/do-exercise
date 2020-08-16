import { useState } from 'react';
import styles from './index.css';
import styled from 'styled-components'
import router from 'umi/router';
import SyncButton from './sync';
import monitor from '@/utils/monitor';
import { NavBar, Icon, Modal } from 'antd-mobile';

const Wrap = styled.div`
    padding: 0 12px;
`;

const Footer = styled.div`
    position: fixed;
    bottom: 20px;
    width: 100vw;
    text-align: center;
`;

const Link = styled.div`
    display: inline;
    color: blue;
    text-decoration: underline;
`;

const Image = styled.img`
    width: 80%;
`;

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}


let count = 0;

function BasicLayout(props) {
    const [show, setShow] = useState(false);
    const { location } = props;
    const onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    const handleLeft = () => {
        if (location.pathname !== '/') {
            router.push('/')
        }   
     }

    const handleSearch = () => {
        if(count++ > 4) {
            monitor();
        }
    }

    return (
        <div className={styles.normal}>
            <NavBar
                mode="light"
                icon={location.pathname !== '/' ? <Icon type="left" /> : <SyncButton></SyncButton>}
                onLeftClick={handleLeft}
                rightContent={[
                    <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={ handleSearch}/>,
                    <Icon key="1" type="ellipsis" />,
                ]}
            >简易答题器</NavBar>
            <Wrap>
                {props.children}
            </Wrap>
            <Footer>有问题，请联系<Link onClick={() => setShow(true)}>作者</Link></Footer>
            <Modal
                visible={show}
                transparent
                maskClosable={true}
                onClose={() => setShow(false)}
                title="作者微信"
                footer={[{ text: '关闭', onPress: () => setShow(false) }]}
                wrapProps={{ onTouchStart: onWrapTouchStart }}
            >
                <div style={{ height: 300, overflow: 'scroll' }}>
                    <Image src='https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/3597264716/4a62/f06e/e0b1/4c3b53a548a225d514ba8f3bd646b648.png'></Image>
                </div>
            </Modal>
        </div>
    );
}

export default BasicLayout;
