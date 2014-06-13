class SiteController < ApplicationController
  
  before_filter :authenticate_user!, except: :index

  def index
    if user_signed_in?
      redirect_to dashboard_path
    end
  end

  def show
  end
  
end