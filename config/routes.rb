WdiFinal::Application.routes.draw do

  devise_for :users
  root to: 'site#index'
  resources :site
  get '/auth/:provider/callback', to: 'site#omniauth'

end
