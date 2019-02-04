import ResetPassword from '../components/PasswordReset'

const PasswordReset = props => (
    <div>
        <ResetPassword resetToken={props.query.resetToken} />
    </div>
)

export default PasswordReset
