import styled from 'styled-components';

import Signup from '../components/Signup'
import Signin from '../components/Signin'
import RequestPasswordReset from '../components/RequestPasswordReset'

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;


const SignupPage = props => (
    <Columns>
        <Signup />
        <Signin />
        <RequestPasswordReset />
    </Columns>
)

export default SignupPage

