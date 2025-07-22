import { Alert } from 'react-bootstrap'; //导入 Bootstrap 的 Alert 组件

const Message = ({ variant, children }) => {
  return (
    <Alert variant={variant}>
      {children}
    </Alert>
  )
}

Message.defaultProps = {
    variant: 'info', //如果用户没有传 variant，就默认是 info 蓝色提示
};

export default Message

//variant提示类型（success、danger、info 等）
//children	React 里的插槽内容，就是提示框里的文字