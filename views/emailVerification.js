const emailTemplate = (link) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>

        .whole_wrapper {
          padding-top: 2.5rem;
          padding-left: 4rem;
          padding-right: 4rem;
          text-align: center;
          align-items: center;
        }
  
        .logo {
          height: auto;
          width: 5.5rem;
        }
        .content {
          margin-left: auto;
          margin-right: auto;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          margin-top: 1.3rem;
          border-radius: 20px;
          background-color: #f6f8fe;
          padding: 0.5% 10% 0.5% 10%;
          font-weight: 500;
          width: 50%;
          min-width: 300px;
        }
        .email_image {
          width: 6.5rem;
        }
        h3 {
          font-size: 1.5rem;
        }
        .text {
          color: #999ca8;
        }
        .footer {
          color: #b1b2b4;
          font-size: 0.7rem;
        }
        .the_button {
          margin-left: auto;
          margin-right: auto;
          background-color: #e51a41;
          border-radius: 5px;
          max-width: 250px;
          max-height:100px;
          color: white !important;  
          padding: 3% 2%;
          cursor: pointer;
          margin-top: 5%;
        }
        a{
          color: white !important;  
          text-decoration: none;
        }
        .svg_icon {
          height: 1.2rem;
          margin: 0 2rem 0 0;
        }
        .icon_footer {
          display: flex;
          width: 10rem;
          margin-top: 15%;
          margin-left: auto;
          margin-right: auto;
        }
        @media only screen and (max-width: 400px) {

          .whole_wrapper {
            padding-left: 0rem;
            padding-right: 0rem;
          }
          .content{
            padding: 0.5% 0% 0.5% 0%;
            width: 90%;
            min-width:90%;
          }
        }
  
        
      </style>

    </head>
    <body>
      <div class="whole_wrapper">
        <img src="${process.env.DOMAIN}/static/logo.png" class="logo" />
        <div class="content">
          <h3>Verify your email address</h3>
          <img src="${process.env.DOMAIN}/static/email.jpg" class="email_image" />
          <p class="text">
            Please confirm that you want to use this as your ooda account email
            address. Once it&#8218;s done you&#8218;ll be able to start your
            journey with ooda!
          </p>
          <a href="${link}"><div class="the_button">Verify my email</div></a>
          <p class="footer">&copy; Copyright 2022 OODA</p>
        </div>
      </div>
    </body>
  </html>
  `;
};

export default emailTemplate;

// <!-- TODO add links to footer buttons -->
