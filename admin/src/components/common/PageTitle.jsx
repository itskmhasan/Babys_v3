import React from "react";
import { Helmet } from "react-helmet";

const PageTitle = ({ title, description }) => {
  return (
    <Helmet>
      <title>
        {" "}
        {title
          ? `${title} | React eCommerce Admin Dashboard`
          : "Babys | Best Shop for Moms and Babies - Admin Dashboard"}
      </title>
      <meta
        name="description"
        content={
          description
            ? ` ${description} `
            : "Babys | Best Shop for Moms and Babies - Admin Dashboard"
        }
      />
    </Helmet>
  );
};

export default PageTitle;
