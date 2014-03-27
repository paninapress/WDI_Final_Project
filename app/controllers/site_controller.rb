class SiteController < ApplicationController
  
  before_filter :authenticate_user!, except: :index

  def index
  end

  def show
  end
  
end