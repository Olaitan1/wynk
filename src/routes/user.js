const router = require('express').Router();
const {register,login, purchaseElectricity,getUser} = require('../controller/user-controller')
const {  protect } = require ('../middleware/authorization')

router.post('/register',register)
/**
 * @openapi
 * '/blog/register':
 *  post:
 *    tags:
 *      - Auth
 *    summary: Register a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *    responses:
 *       201:
 *         description: User created sucessfully.
 *         content:
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/CreateUserResponse'
 *       500:
 *         description: internal server error
 *
 */
router.post('/login', login);
/**
 * @openapi
 * /blog/login:
 *   post:
 *      tags: [Auth]
 *      summary: login a user
 *      description: verify user
 *      parameters:
 *       - name: signature
 *         in: path
 *         required: true
 *         type: string
 *      responses:
 *        200:
 *          description: Returns verified true.
 */
router.post('/buy-light', protect, purchaseElectricity)
router.get('/get-user/:userId', getUser)
module.exports = router