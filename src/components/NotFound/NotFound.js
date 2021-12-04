import classes from "./notFound.module.scss";
const NotFound = () => {
  return (
    <div className={classes.bodyNotFound}>
      <span className={classes.notFound}>Page not found</span>
      <a href="/" className={classes.returnHome}>
        Nhấn để trở về trang chủ
      </a>
    </div>
  );
};

export default NotFound;
