class SiteController < ApplicationController
  # respond_to :json
  def index
  end

  def omniauth
    provider = params['provider']
    # call method from user.rb that will return the parsed information
    # from the response that we should already have when this controller method is called
    # and wrap that up in JSON for the Angular controller to collect via $http
    # User.get_info (provider, request.env['omniauth.auth']
    auth = request.env['omniauth.auth']
    binding.pry
    render :json => auth
  end
  
end