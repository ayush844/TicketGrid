export const forgotPasswordTemplate = (data: any) => {
    return `
        <div style="font-family: Arial; padding: 20px;">
            <h2>🔐 Reset Your Password</h2>
 
            <p>You requested a password reset.</p>
 
            <a href="${data.resetLink}"
               style="display:inline-block; padding:10px 15px; background:#ef4444; color:white; text-decoration:none; border-radius:6px;">
               Reset Password
            </a>
 
            <p style="margin-top:10px;">This link expires in 15 minutes.</p>
 
            <hr/>
            <p style="font-size:12px; color:gray;">
                If you didn’t request this, ignore this email.
            </p>
        </div>
    `;
};
 