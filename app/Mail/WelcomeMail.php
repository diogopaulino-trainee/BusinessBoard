<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

/**
 * Class WelcomeMail
 * 
 * Handles the email sent to newly registered users upon account creation.
 */
class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The user instance associated with the email.
     * 
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new message instance.
     * 
     * @param \App\Models\User $user The user receiving the welcome email.
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Build the email message.
     * 
     * @return $this Configured email instance.
     */
    public function build()
    {
        return $this->subject('Welcome to Business Board!')
                    ->view('emails.welcome');
    }
}
