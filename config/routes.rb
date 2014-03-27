WdiFinal::Application.routes.draw do

  devise_for :users
  root to: 'site#index'
  resources :users
  get '/auth/:provider/callback', to: 'users#omniauth'

end
