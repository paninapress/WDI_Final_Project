class User < ActiveRecord::Base
  belongs_to :first_name
  belongs_to :last_name

  def self.get_info provider response
    #response should == request.env['omniauth.auth']
  end

end
