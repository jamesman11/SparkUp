require 'rubygems'
require 'active_support/all'
require 'mail'

class EmailUtil
  def self.mail(params)
    mail = Mail.new do
      from     params[:from].presence || 'SparkUp <huaxianm@gmail.com>' # TODO: Modulator official e-mail
      to       params[:to].presence || 'ciciliuchengchen@gmail.com'
      subject  params[:subject].presence || 'You got a lunch request'
      body     params[:body].presence || ''
    end

    mail.delivery_method :sendmail
    mail.deliver
  end
end