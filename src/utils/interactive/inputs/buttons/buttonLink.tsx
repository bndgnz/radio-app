import Link from "next/link";
function ButtonLink(props) {
  return (
    <>
      <section className="section-title">
        <div className="container">
          <Link href={`/${props.link}`}>
            <a className="default-btn">
              {props.text} <span></span>
            </a>
          </Link>
        </div>
      </section>
    </>
  );
}
export default ButtonLink
