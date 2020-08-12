import { useState } from 'react';
import styles from './index.css';
import styled from 'styled-components'
import self from '@/assets/self.png';
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
  

function BasicLayout(props) {
    const [show, setShow] = useState(false);
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
    return (
        <div className={styles.normal}>
            <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={() => console.log('onLeftClick')}
                rightContent={[
                    <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
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
                    <Image src={self}></Image>
                </div>
            </Modal>
        </div>
    );
}

export default BasicLayout;
