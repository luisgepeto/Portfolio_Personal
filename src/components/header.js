import { Link } from "gatsby"
import styled from "@emotion/styled"
import PropTypes from "prop-types"
import React from "react"

const Content = styled.div`
  max-width: 860px;
  padding: 1rem 1.0875rem;
  font-size: 1.2rem;
`

const NavLink = styled(Link)`
  text-decoration: none;
  position: relative;
  margin-left: 15px;

  ::after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 70%;
    left: -0.1px;
    right: -0.1px;
    bottom: 0;
    transition: top 0.1s ease-in-out;
    background-color: rgba(18, 111, 114, 0.8);
  }

  :hover::after {
    top: 0;
  }
`

const GitHubLink = styled(NavLink)``

const HomeLink = styled(NavLink)`
  margin-left: 0;
`

const SiteHeader = styled.header`
  background: transparent;
  display: flex;
  align-content: center;
  justify-content: center;
`

const Header = ({ siteTitle }) => (
  <SiteHeader>
    <Content>
      <p>
      <HomeLink to="/">Home</HomeLink>        
      <NavLink to="/blog">Blog</NavLink>
        <GitHubLink href="https://www.linkedin.com/in/luis-becerril-09b26789">LinkedIn</GitHubLink>
        <GitHubLink href="https://github.com/luisgepeto/">GitHub</GitHubLink>
      </p>
    </Content>
  </SiteHeader>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
